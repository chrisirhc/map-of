"use client";
import "client-only";

import { use, useState } from "react";

// Leaflet dependencies
import "leaflet/dist/leaflet.css";
// Hack to get Marker icons to load, see https://github.com/PaulLeCam/react-leaflet/issues/1081#issuecomment-1934655181
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// Imported in the render function to avoid SSR error that looks like `ReferenceError: window is not defined`
import "leaflet-defaulticon-compatibility";
import { Marker, Popup, TileLayer, MapContainer, useMap } from "react-leaflet";
import {
  APILoader,
  PlacePicker,
} from "@googlemaps/extended-component-library/react";

import type { MapMarkers } from "../app/l/[outletId]/data";
import L from "leaflet";
import styles from "./map.module.css";

type Place = google.maps.places.Place;

export function Map({
  center,
  mapMarkers,
}: {
  center: [number, number];
  mapMarkers: MapMarkers;
}) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>();
  const handlePlaceChange: React.ComponentProps<
    typeof PlacePicker
  >["onPlaceChange"] = (e) => {
    // EventTarget type isn't correct so need to do this cast.
    const place = (e.target as React.ComponentRef<typeof PlacePicker>).value;
    setSelectedPlace(place);
  };
  const countries = ["sg"];
  const mapMarkersData = use(mapMarkers);
  return (
    <div>
      <>
        <APILoader
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          solutionChannel="GMP_GCC_placepicker_v1"
        />
        <PlacePicker
          country={countries}
          placeholder="Enter a place to see its address"
          onPlaceChange={handlePlaceChange}
        />
      </>
      <MapContainer
        style={{ height: "500px", width: "500px" }}
        center={
          selectedPlace?.location ? selectedPlace.location.toJSON() : center
        }
        zoom={16}
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
        <ShowGooglePlace place={selectedPlace} />
      </MapContainer>
    </div>
  );
}

const PlaceIcon = L.divIcon({
  className: styles.placeicon,
  iconSize: [30, 30],
});

function ShowGooglePlace({ place }: { place?: Place | null }) {
  const map = useMap();
  if (!place?.location) {
    return null;
  }
  map.setView(place.location.toJSON(), map.getZoom(), { animate: true });
  return (
    <Marker
      position={place.location.toJSON()}
      icon={PlaceIcon}
      zIndexOffset={1000}
    >
      <Popup>{place?.displayName}</Popup>
    </Marker>
  );
}
