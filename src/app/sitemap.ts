import { MetadataRoute } from "next";
import { getAllData } from "./data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getAllData();
  const domain = "https://postbox.b65.dev";
  return (
    data
      // There are scenarios where outletId is empty
      .filter(({ outletId }) => outletId)
      .map(({ outletId }) => ({
        url: `${domain}/l/${outletId}`,
        // Figure this out later.
        // lastModified: new Date(),
        changeFrequency: "monthly",
      }))
  );
}
