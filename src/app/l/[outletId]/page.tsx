import Head from "next/head";
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CivicStructure",
    name: "Springfield Town Hall",
    openingHours: ["Mo-Fr 09:00-17:30", "Sa 09:00-12:00"],
  };
  return (
    <>
      <Head>
        <script
          {...jsonLdScriptProps<CivicStructure>({
            "@context": "https://schema.org",
            "@type": "CivicStructure",
            name: data.outletName,
            address: {
              "@type": "PostalAddress",
              streetAddress: `${data.unitNumber} ${data.buildingName} ${data.streetName}`,
              addressLocality: data.town_suburb,
              postalCode: data.postCode ?? undefined,
              addressCountry: "SG",
            },
            keywords: data.outletType,
            latitude: data.latitude,
            longitude: data.longitude,
            openingHours: data.operatingHours ?? undefined,
          })}
        />
      </Head>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        ></script>
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
