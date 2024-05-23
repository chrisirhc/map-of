import { ClientOnlyMap } from "@/components/client-only-map";
import styles from "./page.module.css";
import { getGeoJSONData } from "./data";

export default function Home() {
  const data = getGeoJSONData();
  return (
    <main className={styles.main}>
      <ClientOnlyMap data={data} />
    </main>
  );
}
