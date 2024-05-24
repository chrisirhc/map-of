import { MapData } from "@/types/main";
import { OpeningHoursSpecification } from "schema-dts";
import "server-only";
import { Feature, FeatureCollection, Point } from "geojson";

export type AllData = ReturnType<typeof processData>;
export type GeoJSONProperties = AllData[number];
export type DataFeature = Feature<Point, GeoJSONProperties>;
export type MapMarkers = ReturnType<typeof getMapData>;
let data: AllData;

async function getLocalData() {
  throw new Error();
  // Used for debugging locally.
  // return await import("../../map-data-2024-05-09.json").then(
  //   (module) => module.default
  // );
}

export async function getAllData(): Promise<AllData> {
  if (data) return data;
  const fetchedData = await (() => {
    // Used for debugging locally.
    // return getLocalData();
    if (!process.env.DATA_LOCATION) {
      throw new Error("DATA_LOCATION not set");
    }
    return fetch(process.env.DATA_LOCATION).then(
      async (res) => (await res.json()) as MapData
    );
  })();
  data = processData(fetchedData);
  return data;
}

export async function getGeoJSONData() {
  const allData = await getAllData();
  return processDataToGeoJSON(allData);
}

export async function getMapData() {
  const allData = await getAllData();
  return allData.map(({ latitude, longitude, outletName, outletId }) => ({
    latitude,
    longitude,
    outletName,
    outletId,
  }));
}

function processData(data: MapData) {
  return data.data_map.map((location) => ({
    ...location,
    latitude: parseFloat(location.latitude),
    longitude: parseFloat(location.longitude),
    operatingHoursSchema: location.operatingHours
      ? convertOperatingHours(location.operatingHours)
      : null,
  }));
}

function processDataToGeoJSON(
  allData: AllData
): FeatureCollection<Point, GeoJSONProperties> {
  return {
    type: "FeatureCollection",
    features: allData.map((location) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      properties: location,
    })),
  };
}

export const getData = async (outletId: string) =>
  (await getAllData()).find((location) => location.outletId === outletId);

/**
 * Converts:
 * Monday 00:00-17:00 Tuesday 00:00-17:00 Wednesday 00:00-17:00 Thursday 00:00-17:00 Friday 00:00-18:00 Saturday Closed Sunday Closed Holiday Closed
 * 
 * To: 
 * [
    {
      "@type": "OpeningHoursSpecification",
      "closes":  "17:00:00",
      "dayOfWeek": "https://schema.org/Sunday",
      "opens":  "09:00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "closes": "17:00:00" ,
      "dayOfWeek": "https://schema.org/Saturday",
      "opens": "09:00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "closes":  "17:00:00",
      "dayOfWeek": "https://schema.org/Thursday",
      "opens": "09:00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "closes": "17:00:00",
      "dayOfWeek": "https://schema.org/Tuesday",
      "opens": "09:00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "closes": "17:00:00",
      "dayOfWeek":  "https://schema.org/Friday",
      "opens": "09:00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "closes": "17:00:00",
      "dayOfWeek": "https://schema.org/Monday",
      "opens": "09:00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "closes": "17:00:00",
      "dayOfWeek":  "https://schema.org/Wednesday",
      "opens": "09:00:00"
    }
  ]
 */
export const convertOperatingHours = (
  operatingHours: string
): OpeningHoursSpecification[] => {
  operatingHours = operatingHours.trim();
  const days = operatingHours.split(" ").filter((_, i) => i % 2 === 0);
  const times = operatingHours.split(" ").filter((_, i) => i % 2 !== 0);

  return days.flatMap((day, i) => {
    switch (day) {
      case "Monday":
      case "Tuesday":
      case "Wednesday":
      case "Thursday":
      case "Friday":
      case "Saturday":
      case "Sunday":
        break;
      case "Holiday":
        return [];
      default:
        throw new Error(`Invalid day: ${day}`);
    }
    if (times[i] == "Closed") return [];

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${day}`,
        opens: times[i].split("-")[0],
        closes: times[i].split("-")[1],
      },
    ];
  });
};
