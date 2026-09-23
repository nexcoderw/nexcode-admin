import { Briefcase01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortfolioEmptyState } from "@/components/portfolio/PortfolioEmptyState/PortfolioEmptyState";
import { PortfolioFiltersDialog } from "@/components/portfolio/PortfolioFiltersDialog/PortfolioFiltersDialog";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid/PortfolioGrid";
import { PortfolioPagination } from "@/components/portfolio/PortfolioPagination/PortfolioPagination";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { listPortfolios } from "@/endpoints/portfolio/list-portfolios";
import {
  resolvePortfolioListQuery,
  toPortfolioEndpointQuery,
} from "@/utils/portfolio/portfolio-page-query";
import {
  getPortfolioServerContext,
  listPortfolioTeamMembers,
} from "@/utils/portfolio/portfolio-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Portfolios",
};

interface PortfolioPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  const context = await getPortfolioServerContext();

  if (!context) {
    redirect(ROUTES.auth.login);
  }

  const query = resolvePortfolioListQuery(await searchParams);

  const [portfolioResult, teamResult] = await Promise.all([
    listPortfolios(
      context.sessionId,
      context.forwarded,
      toPortfolioEndpointQuery(query),
    ),
    listPortfolioTeamMembers(context),
  ]);

  if (portfolioResult.status === 401 || portfolioResult.status === 403) {
    redirect(ROUTES.auth.login);
  }

  const data = portfolioResult.ok ? portfolioResult.data : null;

  const filtered =
    Boolean(query.search) ||
    Boolean(query.category) ||
    Boolean(query.projectType) ||
    Boolean(query.status) ||
    Boolean(query.teamMemberId) ||
    query.ordering !== "-created_at";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Management</span>

          <h1>Portfolios</h1>

          <p>
            Manage NEXCODE projects, media, team assignments and related links.
          </p>
        </div>

        <div className={styles.actions}>
          <PortfolioFiltersDialog
            query={query}
            teamMembers={teamResult.ok ? teamResult.items : []}
          />

          <Button
            href={ROUTES.admin.portfolioAdd}
            leftIcon={<Icon icon={Briefcase01Icon} size={17} />}
          >
            Add portfolio
          </Button>
        </div>
      </header>

      {!data ? (
        <Alert variant="error" title="Portfolios unavailable">
          Portfolio information could not be loaded.
        </Alert>
      ) : data.items.length === 0 ? (
        <PortfolioEmptyState filtered={filtered} />
      ) : (
        <>
          <PortfolioGrid items={data.items} />

          <PortfolioPagination pagination={data.pagination} query={query} />
        </>
      )}
    </div>
  );
}
