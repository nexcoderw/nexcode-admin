import type {
  Metadata,
} from "next";
import {
  redirect,
} from "next/navigation";

import {
  ClientEmptyState,
} from "@/components/client/ClientEmptyState/ClientEmptyState";
import {
  ClientFiltersDialog,
} from "@/components/client/ClientFiltersDialog/ClientFiltersDialog";
import {
  ClientFormDialogTrigger,
} from "@/components/client/ClientFormDialog/ClientFormDialog";
import {
  ClientGrid,
} from "@/components/client/ClientGrid/ClientGrid";
import {
  ClientPagination,
} from "@/components/client/ClientPagination/ClientPagination";
import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  AUTH_ROUTES,
} from "@/constants/routes/auth-routes";
import {
  ERROR_ROUTES,
} from "@/constants/routes/error-routes";
import {
  listClients,
} from "@/endpoints/client/list-clients";
import {
  resolveClientListQuery,
  toClientEndpointQuery,
} from "@/utils/client/client-page-query";
import {
  getClientServerContext,
} from "@/utils/client/client-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title: "Clients",
  };

interface ClientPageProps {
  searchParams:
    Promise<
      Record<
        string,
        string |
        string[] |
        undefined
      >
    >;
}

export default async function ClientPage({
  searchParams,
}: ClientPageProps) {
  const context =
    await getClientServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const query =
    resolveClientListQuery(
      await searchParams,
    );

  const result =
    await listClients(
      context.sessionId,
      context.forwarded,
      toClientEndpointQuery(
        query,
      ),
    );

  if (
    result.status === 401
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    result.status === 403
  ) {
    redirect(
      ERROR_ROUTES.forbidden,
    );
  }

  const data =
    result.ok
      ? result.data
      : null;

  const filtered =
    Boolean(query.search) ||
    query.ordering !==
      "-created_at";

  return (
    <div
      className={styles.page}
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <span
            className={
              styles.eyebrow
            }
          >
            Management
          </span>

          <h1>
            Clients
          </h1>

          <p>
            Keep every client's name, email and phone number in one place.
          </p>
        </div>

        <div
          className={
            styles.actions
          }
        >
          <ClientFiltersDialog
            query={query}
          />

          <ClientFormDialogTrigger
            mode="add"
          />
        </div>
      </header>

      {!data ? (
        <Alert
          variant="error"
          title="Clients unavailable"
        >
          Client information could not be loaded.
        </Alert>
      ) : data.items.length === 0 ? (
        <ClientEmptyState
          filtered={
            filtered
          }
        />
      ) : (
        <>
          <ClientGrid
            items={
              data.items
            }
          />

          <ClientPagination
            pagination={
              data.pagination
            }
            query={query}
          />
        </>
      )}
    </div>
  );
}