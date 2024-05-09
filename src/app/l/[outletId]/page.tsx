import { getData, getAllData } from "./data";

export async function generateStaticParams() {
  const data = await getAllData();
  return data.map(({ outletId }) => ({ outletId }));
}

export default async function Page({
  params: { outletId },
}: {
  params: { outletId: string };
}) {
  const data = await getData(outletId);
  return <main>{JSON.stringify(data)}</main>;
}
