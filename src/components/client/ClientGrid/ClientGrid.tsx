import {
  ClientCard,
} from "@/components/client/ClientCard/ClientCard";
import type {
  ClientSummary,
} from "@/types/client/client";

import styles from "./ClientGrid.module.css";

interface ClientGridProps {
  items: ClientSummary[];
}

export function ClientGrid({
  items,
}: ClientGridProps) {
  return (
    <div
      className={styles.grid}
    >
      {items.map(
        (client) => (
          <ClientCard
            key={client.id}
            client={client}
          />
        ),
      )}
    </div>
  );
}