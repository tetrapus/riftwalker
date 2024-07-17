import { useEffect, useMemo, useState } from "react";
import useGeolocation from "react-hook-geolocation";
import { colorMap, Drop, itemMap, tagMatchers } from "./item-map";

async function getLocalData({ lat, lon }: LatLon) {
  const result = await fetch("https://overpass-api.de/api/interpreter", {
    body: `data=%5Bout%3Ajson%5D%3B%0A(%0A++node(around%3A500%2C${lat}%2C${lon})(if%3A+count_tags()+%3E+0)%3B%0A++way(around%3A500%2C${lat}%2C${lon})%3B%0A)%3B%0Aout+geom%3B`,
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

interface LatLon {
  lat: number;
  lon: number;
}

interface Coordinate {
  x: number;
  y: number;
}

const tileSize = 25;
const tileDegrees = 0.00005;
const scale = tileSize / tileDegrees;

function mapLatLonToXY(
  position: LatLon,
  latlon: LatLon,
  viewport: Coordinate
): Coordinate {
  const { lat, lon } = latlon;
  const { lat: lat0, lon: lon0 } = position;
  const { x: width, y: height } = viewport;
  const y = height / 2 - (lat - lat0) * scale;
  const x = (lon - lon0) * scale + width / 2;
  return { x, y };
}

function inside(point: Coordinate, vs: Coordinate[]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  var x = point.x,
    y = point.y;

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i].x,
      yi = vs[i].y;
    var xj = vs[j].x,
      yj = vs[j].y;

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

  return (
    <Map
      geolocation={{ lat: geolocation.latitude, lon: geolocation.longitude }}
    />
  );
}

function MapBackground({
  tilePositions,
  geolocation,
}: {
  tilePositions: {
    position: LatLon;
    type: string;
    color: string;
    ways: OSMWay[];
  }[][];
  geolocation: LatLon;
}) {
  return (
    // render each tile
    tilePositions.map((row, x) =>
      row.map(({ position, color }, y) => {
        const xy = mapLatLonToXY(geolocation, position, {
          x: window.innerWidth,
          y: window.innerHeight,
        });
        return (
          <div
            key={`${x}-${y}`}
            css={{
              position: "fixed",
              width: tileSize,
              height: tileSize,
              border: "1px solid white",
            }}
            style={{
              top: xy.y,
              left: xy.x,
              background: color,
            }}
          ></div>
        );
      })
    )
  );
}

function Map({ geolocation }: { geolocation: LatLon }) {
  const offset = [window.innerWidth / 2, window.innerHeight / 2];

  const [features, setFeatures] = useState<OSMElement[]>();
  useEffect(() => {
    getLocalData(geolocation).then((data) => {
      setFeatures(data.elements);
    });
  }, []);

  // to keep things simple, we set tiles to be bound by the nearest 0.0001 degree
  // first, we calculate how many tiles to render in the viewport.
  // to cover unseen area, we multiply by 2.
  const numTiles = {
    x: Math.ceil(window.innerWidth / tileSize) * 2,
    y: Math.ceil(window.innerHeight / tileSize) * 2,
  };

  // now, we anchor everything to the nearest tile centre in the viewport.
  // tile centres are at `tileSize` degree intervals, from the origin.
  // first, we need to find the nearest tile centre to our current position.
  const centreTilePosition = {
    lat: Math.round(geolocation.lat / tileDegrees) * tileDegrees,
    lon: Math.round(geolocation.lon / tileDegrees) * tileDegrees,
  };

  const { items, noMatches, tilePositions } = useMemo(() => {
    // filter out all matches from the item map
    const matches = features?.filter((item) => {
      if (!item.tags) {
        return false;
      }
      return tagMatchers.some((matcher) =>
        matcher.matchers.some((pattern) =>
          Object.entries(pattern).every(
            ([key, value]) => item.tags[key] == value
          )
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
      .filter(Boolean) as { item: OSMNode; drop: Drop }[] | undefined;

    const noMatches = features?.filter((item) => {
      return !matches?.includes(item);
    });

    // now, we get the value for each tile we are rendering
    const tilePositions = Array(numTiles.y)
      .fill(null)
      .map((_, y) =>
        Array(numTiles.x)
          .fill(null)
          .map((_, x) => ({
            position: {
              lat: centreTilePosition.lat + (numTiles.y / 2 - y) * tileDegrees,
              lon: centreTilePosition.lon + (numTiles.x / 2 - x) * tileDegrees,
            } as LatLon,
            type: "grass",
            color: "green",
            ways: [] as OSMWay[],
          }))
      );

    // finally, we determine what to render in each tile
    // to do this, we need to iterate over each way and determine if the midpoint of the tile lies within the polygon.
    // we will use the ray casting algorithm for this.
    tilePositions.forEach((row) => {
      row.forEach((tile) => {
        // for each way
        features?.forEach((way) => {
          if (way.type !== "way") {
            return;
          }
          // first, check if the tile is within the bounding box
          if (
            way.bounds.minlat > tile.position.lat ||
            way.bounds.maxlat < tile.position.lat ||
            way.bounds.minlon > tile.position.lon ||
            way.bounds.maxlon < tile.position.lon
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
          const path = way.geometry.map((latlon) =>
            mapLatLonToXY(geolocation, latlon, {
              x: window.innerWidth,
              y: window.innerHeight,
            })
          );

          if (
            inside(
              mapLatLonToXY(geolocation, tile.position, {
                x: window.innerWidth,
                y: window.innerHeight,
              }),
              path
            )
          ) {
            tile.ways.push(way);
          }
        });
      });
    });

    tilePositions.forEach((row) => {
      row.forEach((tile) => {
        const color = colorMap.find((matcher) =>
          matcher.matchers.some((pattern) =>
            Object.entries(pattern).every(([key, value]) =>
              tile.ways.some((way) =>
                way.tags ? way.tags[key] == value : false
              )
            )
          )
        )?.color;
        if (color) {
          tile.color = color;
        }
      });
    });

    return { items, noMatches, tilePositions };
  }, [features]);

  return (
    <div css={{ color: "white", fontSize: 64 }}>
      <div>
        {/* render the map */}
        <MapBackground
          tilePositions={tilePositions}
          geolocation={geolocation}
        />
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
            const path = feature.geometry.map((latlon) =>
              mapLatLonToXY(geolocation, latlon, {
                x: window.innerWidth,
                y: window.innerHeight,
              })
            );
            if (
              path.every(
                ({ x, y }) =>
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
                d={`M ${path.map(({ x, y }) => `${x} ${y}`).join(" L ")} Z`}
                fill="none"
                stroke="white"
                data-testid={JSON.stringify(feature)}
              />
            );
          })}
        </svg>
        {items?.map(({ item, drop }) => {
          const position = mapLatLonToXY(geolocation, item, {
            x: window.innerWidth,
            y: window.innerHeight,
          });
          return (
            <div
              key={item.id}
              css={{}}
              style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                width: "10px",
                height: "10px",
                transform: "translate(-50%, -50%)",
              }}
              data-testid={JSON.stringify(item)}
            >
              <div>{itemMap[drop?.item] ? itemMap[drop?.item] : ""}</div>
              <div css={{ fontSize: 8 }}>
                {Object.entries(item?.tags || {}).map(
                  ([, value]) => `${value}; `
                )}
              </div>
            </div>
          );
        })}
        {noMatches?.map((item) => {
          if (item.type !== "node") {
            return null;
          }
          const position = mapLatLonToXY(geolocation, item, {
            x: window.innerWidth,
            y: window.innerHeight,
          });
          return (
            <div
              key={item.id}
              css={{}}
              style={{
                position: "fixed",
                top: position.y,
                left: position.x,
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
        {geolocation.lat} {geolocation.lon} {JSON.stringify(geolocation)}
      </div>
    </div>
  );
}

export default App;
