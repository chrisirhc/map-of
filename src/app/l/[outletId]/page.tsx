import Head from "next/head";
import Script from "next/script";
import { jsonLdScriptProps } from "react-schemaorg";
import { CivicStructure } from "schema-dts";
import { getAllData, getData } from "./data";

export async function generateStaticParams() {
  const data = await getAllData();
  return (
    data
      // There are scenarios where outletId is empty
      .filter(({ outletId }) => outletId)
      .map(({ outletId }) => ({ outletId }))
  );
}

export default async function Page({
  params: { outletId },
}: {
  params: { outletId: string };
}) {
  const data = await getData(outletId);
  if (!data) return null;
  return (
    <>
      <Script
        {...jsonLdScriptProps<CivicStructure>({
          "@context": "https://schema.org",
          "@type": "CivicStructure",
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
        {/* {JSON.stringify(data)} */}
      </main>
    </>
  );
}
