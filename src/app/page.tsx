import { ClientOnlyMap } from "@/components/client-only-map";
import styles from "./page.module.css";
import { getMapData } from "./data";

export default function Home() {
  const mapMarkers = getMapData();
  return (
    <main className={styles.main}>
      <h1>Posting boxes in Singapore</h1>
      <ClientOnlyMap mapMarkers={mapMarkers} />
    </main>
  );
}
