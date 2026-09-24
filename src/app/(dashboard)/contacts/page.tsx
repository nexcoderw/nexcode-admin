import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContactEmptyState } from "@/components/contact/ContactEmptyState/ContactEmptyState";
import { ContactFiltersDialog } from "@/components/contact/ContactFiltersDialog/ContactFiltersDialog";
import { ContactPagination } from "@/components/contact/ContactPagination/ContactPagination";
import { ContactTable } from "@/components/contact/ContactTable/ContactTable";
import { Alert } from "@/components/ui/Alert/Alert";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { ERROR_ROUTES } from "@/constants/routes/error-routes";
import { listContacts } from "@/endpoints/contact/list-contacts";
import {
  isContactQueryFiltered,
  resolveContactListQuery,
  toContactEndpointQuery,
} from "@/utils/contact/contact-page-query";
import { getContactServerContext } from "@/utils/contact/contact-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contacts",
};

interface ContactPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const context = await getContactServerContext();

  if (!context) {
    redirect(AUTH_ROUTES.login);
  }

  const query = resolveContactListQuery(await searchParams);

  const result = await listContacts(
    context.sessionId,
    context.forwarded,
    toContactEndpointQuery(query),
  );

  if (result.status === 401) {
    redirect(ERROR_ROUTES.unauthorized);
  }

  if (result.status === 403) {
    redirect(ERROR_ROUTES.forbidden);
  }

  const data = result.ok ? result.data : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Operations</span>
          <h1>Contacts</h1>
          <p>
            Messages sent from the website, with the device and address each
            came from. Respond to send a branded email straight to the sender.
          </p>
        </div>

        <div className={styles.actions}>
          <ContactFiltersDialog query={query} />
        </div>
      </header>

      {data && (
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>{isContactQueryFiltered(query) ? "Matching" : "Messages"}</dt>
            <dd>{data.pagination.totalItems}</dd>
          </div>

          <div className={`${styles.stat} ${styles.highlight}`}>
            <dt>Awaiting reply</dt>
            <dd>{data.unanswered}</dd>
          </div>
        </dl>
      )}

      {!data ? (
        <Alert variant="error" title="Messages unavailable">
          Contact messages could not be loaded.
        </Alert>
      ) : data.items.length === 0 ? (
        <ContactEmptyState filtered={isContactQueryFiltered(query)} />
      ) : (
        <>
          <ContactTable items={data.items} />
          <ContactPagination pagination={data.pagination} query={query} />
        </>
      )}
    </div>
  );
}
