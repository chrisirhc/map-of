"use client";
import "client-only";

import { use, useState, useMemo } from "react";

import MapGL, {
  useMap,
  Source,
  Layer,
  SymbolLayer,
  Popup,
} from "react-map-gl/maplibre";
import {
  APILoader,
  PlacePicker,
} from "@googlemaps/extended-component-library/react";
import NextLink from "next/link";

import type { DataFeature, GeoJSONProperties, MapMarkers } from "../app/data";
import L from "leaflet";
import styles from "./map.module.css";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { FeatureCollection } from "geojson";
import { Link } from "@radix-ui/themes";

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
  const [selectedPlace, setSelectedPlace] = useState<Place | null>();
  const [selectedFeature, setSelectedFeature] = useState<DataFeature | null>();
  const popup = useMemo(() => {
    return new maplibregl.Popup().setText("Hello world!");
  }, []);
  const handlePlaceChange: React.ComponentProps<
    typeof PlacePicker
  >["onPlaceChange"] = (e) => {
    // EventTarget type isn't correct so need to do this cast.
    const place = (e.target as React.ComponentRef<typeof PlacePicker>).value;
    setSelectedPlace(place);
  };
  const zoomLevel = !center ? 12 : 16;
  center ??= [1.34, 103.833333];
  const countries = ["sg"];
  const geojsonData = use(data);
  return (
    <div>
      <>
        <APILoader
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          solutionChannel="GMP_GCC_placepicker_v1"
        />
        <PlacePicker
          style={{ width: "100%" }}
          country={countries}
          placeholder="Search for a location on the map"
          onPlaceChange={handlePlaceChange}
        />
      </>
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

const PlaceIcon = L.divIcon({
  className: styles.placeicon,
  iconSize: [30, 30],
});

/*
function ShowGooglePlace({ place }: { place?: Place | null }) {
  const { current: map } = useMap();
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
*/
