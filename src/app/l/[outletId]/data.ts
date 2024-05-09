import "server-only";

export const getAllData = async () => (
    await import("../../../../get-map-data.json").then((module) => module.default)
  ).data_map;

export const getData = async (outletId: string) =>
  (
    await import("../../../../get-map-data.json").then((module) => module.default)
  ).data_map.find((location) => location.outletId === outletId);
