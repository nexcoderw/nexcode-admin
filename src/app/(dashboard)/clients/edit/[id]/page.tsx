import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import {
  notFound,
  redirect,
} from "next/navigation";

import {
  ClientDeleteAction,
} from "@/components/client/ClientDeleteAction/ClientDeleteAction";
import {
  ClientForm,
} from "@/components/client/ClientForm/ClientForm";
import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  AUTH_ROUTES,
} from "@/constants/routes/auth-routes";
import {
  CLIENT_ROUTES,
} from "@/constants/routes/client-routes";
import {
  getClient,
} from "@/endpoints/client/get-client";
import {
  parseClientId,
} from "@/utils/client/client-id";
import {
  getClientServerContext,
} from "@/utils/client/client-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title: "Edit Client",
  };

interface EditClientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const context =
    await getClientServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const { id } =
    await params;

  const clientId =
    parseClientId(id);

  if (!clientId) {
    notFound();
  }

  const result =
    await getClient(
      clientId,
      context.sessionId,
      context.forwarded,
    );

  if (
    result.status === 404
  ) {
    notFound();
  }

  if (
    result.status === 401 ||
    result.status === 403
  ) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  if (
    !result.ok ||
    !result.client
  ) {
    return (
      <Alert
        variant="error"
        title="Client unavailable"
      >
        This client could not be loaded.
      </Alert>
    );
  }

  const client =
    result.client;

  return (
    <div
      className={styles.page}
    >
      <header
        className={
          styles.header
        }
      >
        <div
          className={
            styles.navigation
          }
        >
          <Button
            href={
              CLIENT_ROUTES.list
            }
            variant="ghost"
            leftIcon={
              <Icon
                icon={
                  ArrowLeft01Icon
                }
                size={17}
              />
            }
          >
            Clients
          </Button>

          <Button
            href={
              CLIENT_ROUTES.detail(
                client.id,
              )
            }
            variant="secondary"
            rightIcon={
              <Icon
                icon={
                  ArrowRight01Icon
                }
                size={17}
              />
            }
          >
            View details
          </Button>
        </div>

        <div
          className={
            styles.heading
          }
        >
          <span>
            Client management
          </span>

          <h1>
            Edit {client.name}
          </h1>
        </div>
      </header>

      <ClientForm
        mode="edit"
        client={client}
      />

      <section
        className={
          styles.danger
        }
      >
        <div>
          <h2>
            Delete client
          </h2>

          <p>
            Permanently remove this client and its stored profile image.
          </p>
        </div>

        <ClientDeleteAction
          clientId={
            client.id
          }
          name={
            client.name
          }
        />
      </section>
    </div>
  );
}