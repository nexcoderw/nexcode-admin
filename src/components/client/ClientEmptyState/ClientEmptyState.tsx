import {
  FilterResetIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import {
  ClientFormDialogTrigger,
} from "@/components/client/ClientFormDialog/ClientFormDialog";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  CLIENT_ROUTES,
} from "@/constants/routes/client-routes";

import styles from "./ClientEmptyState.module.css";

interface ClientEmptyStateProps {
  filtered: boolean;
}

export function ClientEmptyState({
  filtered,
}: ClientEmptyStateProps) {
  return (
    <section
      className={styles.empty}
    >
      <span
        className={styles.icon}
      >
        <Icon
          icon={
            UserGroupIcon
          }
          size={28}
        />
      </span>

      <div
        className={
          styles.content
        }
      >
        <h2>
          {filtered
            ? "No matching clients"
            : "No clients yet"}
        </h2>

        <p>
          {filtered
            ? "No client matches this search. Try a different name, email or phone number."
            : "Add your first client to keep their name and contact details in one place."}
        </p>
      </div>

      {filtered ? (
        <Button
          href={CLIENT_ROUTES.list}
          variant="secondary"
          leftIcon={
            <Icon
              icon={
                FilterResetIcon
              }
              size={17}
            />
          }
        >
          Reset filters
        </Button>
      ) : (
        <ClientFormDialogTrigger mode="add" />
      )}
    </section>
  );
}
