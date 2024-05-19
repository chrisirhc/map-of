import { jsonLdScriptProps } from "react-schemaorg";
import { LocalBusiness } from "schema-dts";
import { getAllData, getData, getMapData as getMapMarkers } from "./data";
import { ClientOnlyMap } from "@/components/client-only-map";
import type { Metadata } from "next";

type Props = {
  params: {
    outletId: string;
  };
};

export async function generateStaticParams() {
  const data = await getAllData();
  return (
    data
      // There are scenarios where outletId is empty
      .filter(({ outletId }) => outletId)
      .map(({ outletId }) => ({ outletId }))
  );
}

export async function generateMetadata({
  params: { outletId },
}: Props): Promise<Metadata> {
  const data = await getData(outletId);
  return {
    title: data?.outletName,
    description: data?.outletType,
  };
}

export default async function Page({ params: { outletId } }: Props) {
  const data = await getData(outletId);
  if (!data) return null;
  const center: [number, number] = [data.latitude, data.longitude];
  const mapMarkers = getMapMarkers();
  return (
    <>
      <script
        {...jsonLdScriptProps<LocalBusiness>({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: data.outletName,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${data.unitNumber ?? ""} ${data.houseBlockNumber ?? ""} ${data.streetName ?? ""} ${data.buildingName ?? ""}`,
            addressLocality: data.town_suburb,
            postalCode: data.postCode ?? undefined,
            addressCountry: "SG",
          },
          keywords: data.outletType,
          latitude: data.latitude,
          longitude: data.longitude,
          openingHoursSpecification: data.operatingHoursSchema ?? undefined,
        })}
      />
      <main>
        <h1>{data?.outletName}</h1>
        <address>
          {data?.unitNumber} {data?.buildingName} {data?.streetName}
          <br />
          {data?.town_suburb} {data?.city} Singapore {data?.postCode}
        </address>
        Opening Hours: {data.operatingHours}
        <section>
          <ClientOnlyMap center={center} mapMarkers={mapMarkers} />
        </section>
      </main>
    </>
  );
}
