import {
  ClientCard,
} from "@/components/client/ClientCard/ClientCard";
import type {
  Client,
} from "@/types/client/client";

import styles from "./ClientGrid.module.css";

interface ClientGridProps {
  items: Client[];
}

export function ClientGrid({
  items,
}: ClientGridProps) {
  return (
    <section
      className={styles.grid}
      aria-label="Clients"
    >
      {items.map(
        (client) => (
          <ClientCard
            key={client.id}
            client={client}
          />
        ),
      )}
    </section>
  );
}
