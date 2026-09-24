import {
  ArrowLeft01Icon,
  File01Icon,
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
  ClientProfile,
} from "@/components/client/ClientProfile/ClientProfile";
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
    title: "Client Details",
  };

interface ClientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
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
    throw new Error(
      "Client unavailable.",
    );
  }

  const client =
    result.client;

  return (
    <div
      className={styles.page}
    >
      <nav
        className={styles.bar}
        aria-label="Client actions"
      >
        <Button
          href={
            CLIENT_ROUTES.list
          }
          variant="ghost"
          size="sm"
          leftIcon={
            <Icon
              icon={
                ArrowLeft01Icon
              }
              size={16}
            />
          }
        >
          Clients
        </Button>

        <div
          className={
            styles.actions
          }
        >
          <Button
            href={
              CLIENT_ROUTES.edit(
                client.id,
              )
            }
            variant="secondary"
            size="sm"
            leftIcon={
              <Icon
                icon={
                  File01Icon
                }
                size={16}
              />
            }
          >
            Edit
          </Button>

          <ClientDeleteAction
            clientId={
              client.id
            }
            name={
              client.name
            }
            compact
          />
        </div>
      </nav>

      <ClientProfile
        client={client}
      />
    </div>
  );
}