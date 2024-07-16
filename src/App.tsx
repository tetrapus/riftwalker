import { useEffect, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { itemMap, tagMatchers } from "./item-map";

async function getLocalData([latitude, longitude]: Coordinate) {
  const result = await fetch("https://overpass-api.de/api/interpreter", {
    body: `data=%5Bout%3Ajson%5D%3B%0A(%0A++node(around%3A500%2C${latitude}%2C${longitude})(if%3A+count_tags()+%3E+0)%3B%0A++way(around%3A500%2C${latitude}%2C${longitude})%3B%0A)%3B%0Aout+geom%3B`,
    method: "POST",
  });
  return result.json();
}

interface OSMNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags: { [key: string]: string };
}

interface OSMWay {
  type: "way";
  id: number;
  nodes: number[];
  bounds: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
  geometry: {
    lat: number;
    lon: number;
  }[];
  tags: { [key: string]: string };
}

type OSMElement = OSMNode | OSMWay;

type Coordinate = [number, number];

const tileSize = 25;
const tileDegrees = 0.00005;
const scale = tileSize / tileDegrees;

function mapLatLonToXY(
  position: Coordinate,
  latlon: Coordinate,
  viewport: Coordinate
): Coordinate {
  const [lat, lon] = latlon;
  const [lat0, lon0] = position;
  const [width, height] = viewport;
  const x = width / 2 - (lat - lat0) * scale;
  const y = (lon - lon0) * scale + height / 2;
  return [y, x];
}

function mapXYToLatLon(
  position: Coordinate,
  xy: Coordinate,
  viewport: Coordinate
) {
  const [x, y] = xy;
  const [lat0, lon0] = position;
  const [width, height] = viewport;
  const lat = x / scale + lat0 - width / 2;
  const lon = y / scale + lon0 - height / 2;
  return [lat, lon];
}

function inside(point: Coordinate, vs: Coordinate[]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function App() {
  const geolocation = useGeolocation();

  if (!geolocation.latitude) {
    return <div>Loading...</div>;
  }

  return <Map geolocation={geolocation} />;
}

function Map({
  geolocation,
}: {
  geolocation: { latitude: number; longitude: number };
}) {
  const offset = [window.innerWidth / 2, window.innerHeight / 2];

  const [features, setFeatures] = useState<OSMElement[]>();
  useEffect(() => {
    getLocalData([geolocation.latitude, geolocation.longitude]).then((data) => {
      setFeatures(data.elements);
    });
  }, []);

  // filter out all matches from the item map
  const matches = features?.filter((item) => {
    if (!item.tags) {
      return false;
    }
    return tagMatchers.some((matcher) =>
      matcher.matchers.some((pattern) =>
        Object.entries(pattern).every(([key, value]) => item.tags[key] == value)
      )
    );
  });

  const items = features
    ?.filter((item) => item.type === "node")
    ?.map((item) => {
      if (!item.tags) {
        return undefined;
      }
      const dropMatches = tagMatchers.find((matcher) =>
        matcher.matchers.find((pattern) =>
          Object.entries(pattern).every(
            ([key, value]) => item.tags[key] == value
          )
        )
      );
      const drop = dropMatches?.drops[0];
      return { item, drop };
    })
    .filter(Boolean);

  const noMatches = features?.filter((item) => {
    return !matches?.includes(item);
  });

  console.log(items);

  // to keep things simple, we set tiles to be bound by the nearest 0.0001 degree
  // first, we calculate how many tiles to render in the viewport.
  // to cover unseen area, we multiply by 2.
  const numTiles = [
    Math.ceil(window.innerWidth / tileSize) * 2,
    Math.ceil(window.innerHeight / tileSize) * 2,
  ];

  // now, we anchor everything to the nearest tile centre in the viewport.
  // tile centres are at `tileSize` degree intervals, from the origin.
  // first, we need to find the nearest tile centre to our current position.
  const centreTilePosition = [
    Math.round(geolocation.latitude / tileDegrees) * tileDegrees,
    Math.round(geolocation.longitude / tileDegrees) * tileDegrees,
  ];

  // now, we get the value for each tile we are rendering
  const tilePositions = Array(numTiles[0])
    .fill(null)
    .map((_, x) =>
      Array(numTiles[1])
        .fill(null)
        .map((_, y) => ({
          position: [
            centreTilePosition[0] + (x - numTiles[0] / 2) * tileDegrees,
            centreTilePosition[1] + (y - numTiles[1] / 2) * tileDegrees,
          ],
          type: "grass",
          color: "green",
          ways: [] as OSMWay[],
        }))
    );

  // finally, we determine what to render in each tile
  // to do this, we need to iterate over each way and determine if the midpoint of the tile lies within the polygon.
  // we will use the ray casting algorithm for this.
  tilePositions.forEach((row, x) => {
    row.forEach((tile, y) => {
      // for each way
      features?.forEach((way) => {
        if (way.type !== "way") {
          return;
        }
        // first, check if the tile is within the bounding box
        if (
          way.bounds.minlat > tile.position[0] ||
          way.bounds.maxlat < tile.position[0] ||
          way.bounds.minlon > tile.position[1] ||
          way.bounds.maxlon < tile.position[1]
        ) {
          return;
        }
        // we also only care about closed ways
        if (
          way.nodes[0] !== way.nodes[way.nodes.length - 1] ||
          way.nodes.length < 3
        ) {
          return;
        }

        // now, we need to check if the tile is within the polygon
        const path = way.geometry.map(({ lat, lon }) =>
          mapLatLonToXY(
            [geolocation.latitude, geolocation.longitude],
            [lat, lon],
            [window.innerWidth, window.innerHeight]
          )
        );

        if (
          inside(
            mapLatLonToXY(
              [geolocation.latitude, geolocation.longitude],
              tile.position,
              [window.innerWidth, window.innerHeight]
            ),
            path
          )
        ) {
          tile.ways.push(way);
        }
      });
    });
  });

  // now we assign some colors
  const colorMap = [
    {
      matchers: [{ landuse: "residential" }],
      color: "red",
    },
    // surface: concrete => grey
    {
      matchers: [{ surface: "concrete" }],
      color: "grey",
    },
    // amenity: college -> orange
    {
      matchers: [{ amenity: "college" }],
      color: "orange",
    },
    // landuse: railway => blue
    {
      matchers: [{ landuse: "railway" }, { railway: "station" }],
      color: "blue",
    },
    // leisure: park -> black
    {
      matchers: [{ leisure: "park" }],
      color: "black",
    },
    // tourism: gallery -> purple
    {
      matchers: [{ tourism: "gallery" }],
      color: "purple",
    },
    // landuse: commercial => yellow
    {
      matchers: [{ landuse: "commercial" }],
      color: "yellow",
    },
  ];

  tilePositions.forEach((row) => {
    row.forEach((tile) => {
      const color = colorMap.find((matcher) =>
        matcher.matchers.some((pattern) =>
          Object.entries(pattern).every(([key, value]) =>
            tile.ways.some((way) => (way.tags ? way.tags[key] == value : false))
          )
        )
      )?.color;
      if (color) {
        tile.color = color;
      }
    });
  });

  // log tiles with ways
  console.log(
    tilePositions.map((row) =>
      row
        .filter((tile) => tile.ways.length > 0)
        .map((tile) => tile.ways.map((way) => way.tags))
    )
  );

  return (
    <div css={{ color: "white", fontSize: 64 }}>
      <div>
        {/* render the map */}
        {
          // render each tile
          tilePositions.map((row, x) =>
            row.map(({ position, type, color }, y) => {
              const xy = mapLatLonToXY(
                [geolocation.latitude, geolocation.longitude],
                position,
                [window.innerWidth, window.innerHeight]
              );
              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    position: "fixed",
                    top: xy[1],
                    left: xy[0],
                    width: tileSize,
                    height: tileSize,
                    background: color,
                    border: "1px solid white",
                  }}
                ></div>
              );
            })
          )
        }
        <svg
          css={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
          }}
          viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        >
          {/* draw each way */}
          {}

          {features?.map((feature) => {
            if (feature.type !== "way") {
              return null;
            }
            // ignore everything not in viewport at all
            const path = feature.geometry.map(({ lat, lon }) =>
              mapLatLonToXY(
                [geolocation.latitude, geolocation.longitude],
                [lat, lon],
                [window.innerWidth, window.innerHeight]
              )
            );
            if (
              path.every(
                ([x, y]) =>
                  x < 0 ||
                  y < 0 ||
                  x > window.innerWidth ||
                  y > window.innerHeight
              )
            ) {
              return null;
            }
            return (
              <path
                key={feature.id}
                d={`M ${path.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`}
                fill="none"
                stroke="white"
                data-testid={JSON.stringify(feature)}
              />
            );
          })}
        </svg>
        {items?.map(({ item, drop }) => {
          const position = mapLatLonToXY(
            [geolocation.latitude, geolocation.longitude],
            [item.lat, item.lon],
            [window.innerWidth, window.innerHeight]
          );
          return (
            <div
              key={item.id}
              css={{}}
              style={{
                position: "fixed",
                top: position[1],
                left: position[0],
                width: "10px",
                height: "10px",
                transform: "translate(-50%, -50%)",
              }}
              data-testid={JSON.stringify(item)}
            >
              <div>{itemMap[drop?.item] ? itemMap[drop?.item] : ""}</div>
              <div css={{ fontSize: 8 }}>
                {Object.entries(item?.tags || {}).map(
                  ([key, value]) => `${value}; `
                )}
              </div>
            </div>
          );
        })}
        {noMatches?.map((item) => {
          const position = mapLatLonToXY(
            [geolocation.latitude, geolocation.longitude],
            [item.lat, item.lon],
            [window.innerWidth, window.innerHeight]
          );
          return (
            <div
              key={item.id}
              css={{}}
              style={{
                position: "fixed",
                top: position[1],
                left: position[0],
                width: "10px",
                height: "10px",
                background: "red",
                transform: "translate(-50%, -50%)",
              }}
            >
              {item.tags && item.tags[0] ? item.tags[0][0] : ""}
            </div>
          );
        })}
        {/* me */}
        <div
          css={{
            position: "fixed",
            top: offset[1],
            left: offset[0],
            width: "10px",
            height: "10px",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* person emoji */}
          🧍
        </div>
      </div>
      <div
        css={{
          background: "#111",
          position: "fixed",
          bottom: 0,
          height: "50px",
          left: 0,
          width: "100vw",
          color: "white",
          fontSize: 12,
        }}
      >
        {geolocation.latitude} {geolocation.longitude}{" "}
        {JSON.stringify(geolocation)}
      </div>
    </div>
  );
}

export default App;
