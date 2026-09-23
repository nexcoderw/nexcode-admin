import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortfolioWorkspace } from "@/components/portfolio/PortfolioWorkspace/PortfolioWorkspace";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { PORTFOLIO_ROUTES } from "@/constants/routes/portfolio-routes";
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
    redirect(AUTH_ROUTES.login);
  }

  const teams = await listPortfolioTeamMembers(context);

  if (teams.status === 401 || teams.status === 403) {
    redirect(AUTH_ROUTES.login);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button
          href={PORTFOLIO_ROUTES.list}
          variant="ghost"
          leftIcon={<Icon icon={ArrowLeft01Icon} size={17} />}
        >
          Back to portfolios
        </Button>

        <div>
          <span>Portfolio management</span>

          <h1>Add portfolio</h1>

          <p>
            Fill in the project details, then add images, documents and
            repositories from the tabs above.
          </p>
        </div>
      </header>

      <PortfolioWorkspace mode="add" teamMembers={teams.ok ? teams.items : []} />
    </div>
  );
}
