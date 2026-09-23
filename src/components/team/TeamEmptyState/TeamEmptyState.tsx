import { UserGroupIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import { TEAM_ROUTES } from "@/constants/routes/team-routes";

import { TeamFormDialogTrigger } from "../TeamFormDialog/TeamFormDialog";

import styles from "./TeamEmptyState.module.css";

interface TeamEmptyStateProps {
  filtered: boolean;
}

export function TeamEmptyState({ filtered }: TeamEmptyStateProps) {
  return (
    <section className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        <Icon icon={UserGroupIcon} size={24} />
      </span>

      <div className={styles.content}>
        <h3>{filtered ? "No matching team members" : "No team members yet"}</h3>

        <p>
          {filtered
            ? "Try another search or " + "reset the filters."
            : "Add the first person " + "to the NEXCODE team."}
        </p>
      </div>

      {filtered ? (
        <Link href={TEAM_ROUTES.list} className={styles.secondaryAction}>
          Reset filters
        </Link>
      ) : (
        <TeamFormDialogTrigger mode="add" />
      )}
    </section>
  );
}
