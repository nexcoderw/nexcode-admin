import { Call02Icon, Mail01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/ui/Icon/Icon";
import type { Client } from "@/types/client/client";
import {
  formatClientDate,
  getClientInitials,
} from "@/utils/client/client-format";

import { ClientDeleteAction } from "../ClientDeleteAction/ClientDeleteAction";
import { ClientDetailsDialog } from "../ClientDetailsDialog/ClientDetailsDialog";
import { ClientFormDialogTrigger } from "../ClientFormDialog/ClientFormDialog";

import styles from "./ClientCard.module.css";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.monogram} aria-hidden="true">
          {getClientInitials(client.name)}
        </span>

        <div className={styles.identity}>
          <h2 className={styles.name}>{client.name}</h2>

          <span className={styles.added}>
            Added {formatClientDate(client.createdAt)}
          </span>
        </div>
      </header>

      <ul className={styles.contacts}>
        <li>
          <Icon icon={Mail01Icon} size={16} />

          {client.email ? (
            <a href={`mailto:${client.email}`}>{client.email}</a>
          ) : (
            <span className={styles.missing}>No email</span>
          )}
        </li>

        <li>
          <Icon icon={Call02Icon} size={16} />

          {client.phoneNumber ? (
            <a href={`tel:${client.phoneNumber.replace(/\s+/g, "")}`}>
              {client.phoneNumber}
            </a>
          ) : (
            <span className={styles.missing}>No phone number</span>
          )}
        </li>
      </ul>

      <footer className={styles.actions}>
        <ClientDetailsDialog client={client} />

        <ClientFormDialogTrigger mode="edit" client={client} compact />

        <div className={styles.danger}>
          <ClientDeleteAction
            clientId={client.id}
            name={client.name}
            compact
          />
        </div>
      </footer>
    </article>
  );
}
