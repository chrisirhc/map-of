// This file is required just to set a client boundary between the server and client component.
// The Map component requires the window object to be defined, which is not available during SSR.
"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@radix-ui/themes";
import { FeatureCollection } from "geojson";

// Prevent Map from being rendered via SSR
const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <Skeleton width="100%" height="500px" loading />,
});

export const ClientOnlyMap = ({
  center,
  data,
}: {
  center?: [number, number];
  data: Promise<FeatureCollection>;
}) => {
  return <Map center={center} data={data} />;
};
