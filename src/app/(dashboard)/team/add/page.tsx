import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { TeamForm } from "@/components/team/TeamForm/TeamForm";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Add Team Member",
};

export default function AddTeamMemberPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={ROUTES.admin.team} className={styles.back}>
          <Icon icon={ArrowLeft01Icon} size={17} />
          Back to Team
        </Link>

        <span className={styles.sectionLabel}>Team management</span>

        <h1 className={styles.title}>Add team member</h1>

        <p className={styles.description}>
          Create a new NEXCODE team profile and configure its public
          professional information and imagery.
        </p>
      </header>

      <TeamForm mode="add" />
    </div>
  );
}
