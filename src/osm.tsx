import { LatLon } from "./coordinates";

export async function getLocalData({ lat, lon }: LatLon, size: number) {
  const query = `data=[out:json];(node(${lat},${lon},${lat + size},${
    lon + size
  })(if: count_tags() > 0);way(${lat},${lon},${lat + size},${
    lon + size
  }););out geom;`;

  const result = await fetch("https://overpass-api.de/api/interpreter", {
    body: query,
    method: "POST",
  });
  return result.json();
}

export interface OSMNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags: { [key: string]: string };
}

export interface OSMWay {
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

export type OSMElement = OSMNode | OSMWay;
