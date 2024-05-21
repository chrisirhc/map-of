// This file is required just to set a client boundary between the server and client component.
// The Map component requires the window object to be defined, which is not available during SSR.
"use client";
import { MapMarkers } from "@/app/data";
import dynamic from "next/dynamic";
import { Skeleton } from "@radix-ui/themes";

// Prevent Map from being rendered via SSR
const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <Skeleton width="500px" height="500px" loading />,
});

export const ClientOnlyMap = ({
  center,
  mapMarkers,
}: {
  center?: [number, number];
  mapMarkers: MapMarkers;
}) => {
  return <Map center={center} mapMarkers={mapMarkers} />;
};
