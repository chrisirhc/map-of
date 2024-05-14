"use client";
import "client-only";

// Leaflet dependencies
import "leaflet/dist/leaflet.css";
// Hack to get Marker icons to load, see https://github.com/PaulLeCam/react-leaflet/issues/1081#issuecomment-1934655181
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// Imported in the render function to avoid SSR error that looks like `ReferenceError: window is not defined`
// import "leaflet-defaulticon-compatibility";

import { use } from "react";
import dynamic from "next/dynamic";

// Prevent Map from being rendered via SSR
// Avoid SSR error that looks like `ReferenceError: window is not defined`
const Marker = dynamic(() =>
  import("react-leaflet").then(({ Marker }) => Marker)
);
const Popup = dynamic(() => import("react-leaflet").then(({ Popup }) => Popup));
const TileLayer = dynamic(() =>
  import("react-leaflet").then(({ TileLayer }) => TileLayer)
);
const MapContainer = dynamic(() =>
  import("react-leaflet").then(({ MapContainer }) => MapContainer)
);
import type { MapMarkers } from "./data";

export function Map({
  center,
  mapMarkers,
}: {
  center: [number, number];
  mapMarkers: MapMarkers;
}) {
  // @ts-expect-error Ignore this error
  import("leaflet-defaulticon-compatibility");
  const mapMarkersData = use(mapMarkers);
  return (
    <div>
      <MapContainer
        style={{ height: "500px", width: "500px" }}
        // Hack since it doesn't support readonly tuples
        center={center}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapMarkersData.map((marker) => (
          <Marker
            key={marker.outletId}
            position={[marker.latitude, marker.longitude]}
          >
            <Popup>{marker.outletName}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
