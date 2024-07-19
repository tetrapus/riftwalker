import { mapLatLonToXY, tileSize, LatLon } from "./coordinates";
import { OSMWay } from "./osm";

export function MapBackground({
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
        if (
          xy.x + tileSize < 0 ||
          xy.y + tileSize < 0 ||
          xy.x > window.innerWidth ||
          xy.y > window.innerHeight
        ) {
          return null;
        }

        return (
          <div
            key={`${x}-${y}`}
            css={{
              position: "fixed",
              width: tileSize,
              height: tileSize,
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
