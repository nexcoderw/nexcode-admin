import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortfolioForm } from "@/components/portfolio/PortfolioForm/PortfolioForm";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import {
  getPortfolioServerContext,
  listPortfolioTeamMembers,
} from "@/utils/portfolio/portfolio-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Add Portfolio",
};

export default async function AddPortfolioPage() {
  const context = await getPortfolioServerContext();

  if (!context) {
    redirect(ROUTES.auth.login);
  }

  const teams = await listPortfolioTeamMembers(context);

  if (teams.status === 401 || teams.status === 403) {
    redirect(ROUTES.auth.login);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button
          href={ROUTES.admin.portfolios}
          variant="ghost"
          leftIcon={<Icon icon={ArrowLeft01Icon} size={17} />}
        >
          Back to portfolios
        </Button>

        <div>
          <span>Portfolio management</span>

          <h1>Add portfolio</h1>

          <p>
            Create the project first. Images and related links can be added
            immediately afterwards.
          </p>
        </div>
      </header>

      <PortfolioForm mode="add" teamMembers={teams.ok ? teams.items : []} />
    </div>
  );
}
