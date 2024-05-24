"use client";
import "client-only";

import { use, useState } from "react";

import {
  APILoader,
  PlacePicker,
} from "@googlemaps/extended-component-library/react";
import NextLink from "next/link";
import MapGL, {
  GeolocateControl,
  Layer,
  Marker,
  Popup,
  Source,
  SymbolLayer,
  useMap,
} from "react-map-gl/maplibre";

import { Link } from "@radix-ui/themes";
import { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import type { DataFeature } from "../app/data";

const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`;

type Place = google.maps.places.Place;

const POSTBOX_ICON_ID = "postbox-icon";
const postBoxSymbolLayer: SymbolLayer = {
  id: "postbox",
  source: "postbox",
  type: "symbol",
  layout: {
    "icon-image": POSTBOX_ICON_ID,
    "icon-size": 0.5,
    // "text-anchor": "top",
    // "text-field": ["get", "outletName"],
    // "text-size": 8,
  },
};

export function Map({
  center,
  data,
}: {
  center?: [number, number];
  data: Promise<FeatureCollection>;
}) {
  const [selectedFeature, setSelectedFeature] = useState<DataFeature | null>();
  center ??= [1.34, 103.833333];
  const geojsonData = use(data);
  return (
    <div>
      <></>
      <MapGL
        interactiveLayerIds={["postbox"]}
        initialViewState={{
          longitude: center[1],
          latitude: center[0],
          zoom: 14,
        }}
        style={{ width: "100%", height: 400 }}
        mapStyle={MAP_STYLE}
        onClick={(e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          setSelectedFeature(feature as unknown as DataFeature);
        }}
      >
        <GeolocateControl />
        <MapImage name={POSTBOX_ICON_ID} url="/postbox-transparent.png" />
        <Source type="geojson" data={geojsonData}>
          <Layer {...postBoxSymbolLayer} />
        </Source>
        {selectedFeature ? (
          <Popup
            longitude={selectedFeature.geometry.coordinates[0]}
            latitude={selectedFeature.geometry.coordinates[1]}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedFeature(null)}
            anchor="bottom"
            offset={[0, -30] as [number, number]}
          >
            <Link asChild>
              <NextLink href={`/l/${selectedFeature.properties.outletId}`}>
                {selectedFeature.properties.outletName}
              </NextLink>
            </Link>
          </Popup>
        ) : null}
        <ShowGooglePlace />
      </MapGL>
    </div>
  );
}

function MapImage({
  name,
  url,
  sdf,
}: {
  name: string;
  url: string;
  sdf?: boolean;
}) {
  const { current: map } = useMap();
  if (!map) return null;

  if (!map.hasImage(name)) {
    map.loadImage(url).then(({ data }) => {
      if (!map.hasImage(name)) {
        map.addImage(name, data, { sdf });
      }
    });
  }
  return null;
}

function ShowGooglePlace() {
  const { current: map } = useMap();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>();
  const handlePlaceChange: React.ComponentProps<
    typeof PlacePicker
  >["onPlaceChange"] = (e) => {
    // EventTarget type isn't correct so need to do this cast.
    const place = (e.target as React.ComponentRef<typeof PlacePicker>).value;
    setSelectedPlace(place);
    if (!place?.location) return;
    map?.flyTo({ center: place.location.toJSON(), zoom: 14 });
  };
  const countries = ["sg"];
  if (!map) return null;
  return (
    <div>
      <APILoader
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        solutionChannel="GMP_GCC_placepicker_v1"
      />
      <PlacePicker
        style={{ width: "50%" }}
        country={countries}
        placeholder="Search for a location on the map"
        onPlaceChange={handlePlaceChange}
      />
      {selectedPlace?.location ? (
        <Marker
          longitude={selectedPlace.location.lng()}
          latitude={selectedPlace.location.lat()}
        ></Marker>
      ) : null}
    </div>
  );
}
