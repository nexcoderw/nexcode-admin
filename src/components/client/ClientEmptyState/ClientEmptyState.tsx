import {
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

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
            ? "Change or reset the active client filters."
            : "Add the first client to the NEXCODE client directory."}
        </p>
      </div>

      <Button
        href={
          filtered
            ? CLIENT_ROUTES.list
            : CLIENT_ROUTES.add
        }
        variant={
          filtered
            ? "secondary"
            : "primary"
        }
        leftIcon={
          <Icon
            icon={
              UserGroupIcon
            }
            size={17}
          />
        }
      >
        {filtered
          ? "Reset filters"
          : "Add client"}
      </Button>
    </section>
  );
}