import {
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import {
  redirect,
} from "next/navigation";

import {
  ClientForm,
} from "@/components/client/ClientForm/ClientForm";
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
  getClientServerContext,
} from "@/utils/client/client-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title: "Add Client",
  };

export default async function AddClientPage() {
  const context =
    await getClientServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  return (
    <div
      className={styles.page}
    >
      <header
        className={
          styles.header
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
          Back to clients
        </Button>

        <div>
          <span>
            Client management
          </span>

          <h1>
            Add client
          </h1>

          <p>
            Create a client record with contact information, lifecycle status and optional profile details.
          </p>
        </div>
      </header>

      <ClientForm
        mode="add"
      />
    </div>
  );
}