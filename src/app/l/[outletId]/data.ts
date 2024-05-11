import { OpeningHoursSpecification } from "schema-dts";
import "server-only";

export const getAllData = async () =>
  (
    await import("../../../../get-map-data.json").then(
      (module) => module.default
    )
  ).data_map.map((location) => ({
    ...location,
    operatingHoursSchema: location.operatingHours
      ? convertOperatingHours(location.operatingHours)
      : null,
  }));

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
