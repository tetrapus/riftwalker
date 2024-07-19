export const tileSize = 25;
export const tileDegrees = 0.00005;
export const scale = tileSize / tileDegrees;

export interface Coordinate {
  x: number;
  y: number;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export function mapLatLonToXY(
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

export function inside(point: Coordinate, vs: Coordinate[]) {
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
