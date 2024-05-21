import { ClientOnlyMap } from "@/components/client-only-map";
import styles from "./page.module.css";
import { getMapData } from "./data";
import { Heading } from "@radix-ui/themes";

export default function Home() {
  const mapMarkers = getMapData();
  return (
    <main className={styles.main}>
      <Heading>Posting boxes in Singapore</Heading>
      <ClientOnlyMap mapMarkers={mapMarkers} />
    </main>
  );
}
