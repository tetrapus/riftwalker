import { useState, useEffect, useMemo } from "react";
import { OSMElement, getLocalData, OSMNode, OSMWay } from "./osm";
import { MapBackground } from "./MapBackground";
import { tagMatchers, Drop, colorMap, itemMap } from "./item-map";
import {
  LatLon,
  tileDegrees,
  tileSize,
  scale,
  mapLatLonToXY,
  inside,
} from "./coordinates";

export interface InventoryItem {
  item: string;
  from: OSMElement;
  foundTime: Date;
}

export function Map({ geolocation }: { geolocation: LatLon }) {
  const offset = [window.innerWidth / 2, window.innerHeight / 2];

  const [features, setFeatures] = useState<{ [id: string]: OSMElement }>({});

  const latKey = Math.round(geolocation.lat / tileDegrees) * tileDegrees;
  const lonKey = Math.round(geolocation.lon / tileDegrees) * tileDegrees;

  // to keep things simple, we set tiles to be bound by the nearest 0.0001 degree
  // first, we calculate how many tiles to render in the viewport.
  // to cover unseen area, we multiply by 2.
  const numTiles = {
    x: Math.ceil(window.innerWidth / tileSize) * 2,
    y: Math.ceil(window.innerHeight / tileSize) * 2,
  };

  const biggerDimension = Math.max(numTiles.x, numTiles.y);

  useEffect(() => {
    getLocalData(
      {
        lat: latKey - tileDegrees * biggerDimension,
        lon: lonKey - tileDegrees * biggerDimension,
      },
      tileDegrees * biggerDimension * 2
    ).then((data) => {
      setFeatures((features) => ({
        ...features,
        ...Object.fromEntries(
          data.elements.map((elem: OSMElement) => [elem.id.toString(), elem])
        ),
      }));
    });
  }, [latKey, lonKey]);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // now, we anchor everything to the nearest tile centre in the viewport.
  // tile centres are at `tileSize` degree intervals, from the origin.
  // first, we need to find the nearest tile centre to our current position.
  const centreTilePosition = {
    lat: Math.round(geolocation.lat / tileDegrees) * tileDegrees,
    lon: Math.round(geolocation.lon / tileDegrees) * tileDegrees,
  };

  const { items, noMatches, tilePositions } = useMemo(() => {
    // filter out all matches from the item map
    const matches = Object.values(features).filter((item) => {
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

    const items = Object.values(features)
      .filter((item) => item.type === "node")
      .map((item) => {
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

    const noMatches = Object.values(features).filter((item) => {
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
        Object.values(features).forEach((way) => {
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
    <div
      css={{ color: "white", fontSize: 64 }}
      onClick={(e) => {
        const position = {
          lat: geolocation.lat + (e.clientY - window.innerHeight / 2) / scale,
          lon: geolocation.lon + (e.clientX - window.innerWidth / 2) / scale,
        };
        console.log({ position });

        // get all elements within 10 tiles
        const dropProbability: {
          elem: OSMElement;
          drop: Drop;
          probability: number;
        }[] = [];
        // first, we need to split ways and nodes.
        const ways: OSMWay[] = [];
        const nodes: OSMNode[] = [];

        Object.values(features).forEach((elem) => {
          if (elem.type === "way") {
            ways.push(elem);
          } else if (elem.type === "node") {
            nodes.push(elem);
          }
        });

        // for ways, we first do a check to see if we clicked inside the way
        ways?.forEach((way) => {
          const path = way.geometry.map((latlon) =>
            mapLatLonToXY(geolocation, latlon, {
              x: window.innerWidth,
              y: window.innerHeight,
            })
          );
          if (inside({ x: e.clientX, y: e.clientY }, path)) {
            // if we are inside, we add the way to the drop probability
            const dropMatches = tagMatchers.find((matcher) =>
              matcher.matchers.find((pattern) =>
                Object.entries(pattern).every(
                  ([key, value]) => way.tags[key] == value
                )
              )
            );
            dropMatches?.drops.forEach((drop) => {
              dropProbability.push({
                elem: way,
                drop,
                probability:
                  (10 * tileDegrees) ** 2 / dropMatches?.drops.length,
              });
            });
          } else {
            // otherwise, we can be a bit lazy by using the bounding box to approximate a probability.
            const distance =
              Math.min(
                Math.abs(way.bounds.minlat - position.lat),
                Math.abs(way.bounds.maxlat - position.lat)
              ) **
                2 +
              Math.min(
                Math.abs(way.bounds.minlon - position.lon),
                Math.abs(way.bounds.maxlon - position.lon)
              ) **
                2;
            // if the distance is less than 10 tiles, we add it to the drop probability
            if (distance < (10 * tileDegrees) ** 2) {
              const dropMatches = tagMatchers.find((matcher) =>
                matcher.matchers.find((pattern) =>
                  Object.entries(pattern).every(
                    ([key, value]) => way.tags[key] == value
                  )
                )
              );
              dropMatches?.drops.forEach((drop) => {
                dropProbability.push({
                  elem: way,
                  drop,
                  probability:
                    ((10 * tileDegrees) ** 2 - distance) /
                    dropMatches?.drops.length,
                });
              });
            }
          }
        });

        nodes?.forEach((elem) => {
          const distance =
            Math.abs(elem.lat - position.lat) ** 2 +
            Math.abs(elem.lon - position.lon) ** 2;
          if (distance < (10 * tileDegrees) ** 2) {
            const dropMatches = tagMatchers.find((matcher) =>
              matcher.matchers.find((pattern) =>
                Object.entries(pattern).every(
                  ([key, value]) => elem.tags[key] == value
                )
              )
            );
            dropMatches?.drops.forEach((drop) => {
              dropProbability.push({
                elem,
                drop,
                probability: (10 * tileDegrees) ** 2 - distance,
              });
            });
          }
        });

        console.log(dropProbability);

        // now, we need to determine the drop
        const totalProbability = dropProbability.reduce(
          (acc, { probability }) => acc + probability,
          0
        );

        const random = Math.random() * totalProbability;
        let current = 0;
        let drop: { item: string; from: OSMElement } | undefined;
        for (const { elem, probability, drop: d } of dropProbability) {
          current += probability;
          if (random < current) {
            drop = { item: d.item, from: elem };
            break;
          }
        }

        if (drop) {
          setInventory([
            ...inventory,
            {
              item: drop.item,
              from: drop.from,
              foundTime: new Date(),
            },
          ]);
        }
      }}
    >
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

          {Object.values(features).map((feature) => {
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
                stroke="rgba(255,255,255,0.3)"
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

          if (
            position.x + tileSize < 0 ||
            position.y + tileSize < 0 ||
            position.x > window.innerWidth ||
            position.y > window.innerHeight
          ) {
            return null;
          }

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

          if (
            position.x + tileSize < 0 ||
            position.y + tileSize < 0 ||
            position.x > window.innerWidth ||
            position.y > window.innerHeight
          ) {
            return null;
          }

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
          display: "flex",
        }}
      >
        {inventory.map((item) => (
          <div key={item.foundTime.toString()}>
            {itemMap[item.item] ? itemMap[item.item] : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
