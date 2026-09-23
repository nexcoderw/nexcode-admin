import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PortfolioDeleteAction } from "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction";
import { PortfolioDocumentManager } from "@/components/portfolio/PortfolioDocumentManager/PortfolioDocumentManager";
import { PortfolioForm } from "@/components/portfolio/PortfolioForm/PortfolioForm";
import { PortfolioImageManager } from "@/components/portfolio/PortfolioImageManager/PortfolioImageManager";
import { PortfolioRepositoryManager } from "@/components/portfolio/PortfolioRepositoryManager/PortfolioRepositoryManager";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { getPortfolio } from "@/endpoints/portfolio/get-portfolio";
import { parsePortfolioResourceId } from "@/utils/portfolio/portfolio-id";
import {
  getPortfolioServerContext,
  listPortfolioTeamMembers,
} from "@/utils/portfolio/portfolio-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Edit Portfolio",
};

interface EditPortfolioPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    created?: string;
  }>;
}

export default async function EditPortfolioPage({
  params,
  searchParams,
}: EditPortfolioPageProps) {
  const context = await getPortfolioServerContext();

  if (!context) {
    redirect(ROUTES.auth.login);
  }

  const { id } = await params;

  const portfolioId = parsePortfolioResourceId(id);

  if (!portfolioId) {
    notFound();
  }

  const [portfolioResult, teamResult, query] = await Promise.all([
    getPortfolio(portfolioId, context.sessionId, context.forwarded),
    listPortfolioTeamMembers(context),
    searchParams,
  ]);

  if (portfolioResult.status === 404) {
    notFound();
  }

  if (portfolioResult.status === 401 || portfolioResult.status === 403) {
    redirect(ROUTES.auth.login);
  }

  if (!portfolioResult.ok || !portfolioResult.portfolio) {
    return (
      <Alert variant="error" title="Portfolio unavailable">
        This portfolio could not be loaded.
      </Alert>
    );
  }

  const portfolio = portfolioResult.portfolio;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.navigation}>
          <Button
            href={ROUTES.admin.portfolios}
            variant="ghost"
            leftIcon={<Icon icon={ArrowLeft01Icon} size={17} />}
          >
            Portfolios
          </Button>

          <Button
            href={ROUTES.admin.portfolioDetail(portfolio.id)}
            variant="secondary"
            rightIcon={<Icon icon={ArrowRight01Icon} size={17} />}
          >
            View details
          </Button>
        </div>

        <div>
          <span>Portfolio management</span>

          <h1>Edit {portfolio.name}</h1>
        </div>
      </header>

      {query.created === "1" && (
        <Alert variant="success" title="Portfolio created">
          The main record is ready. You can now add images, document links and
          repositories.
        </Alert>
      )}

      <PortfolioForm
        mode="edit"
        portfolio={portfolio}
        teamMembers={teamResult.ok ? teamResult.items : portfolio.teamMembers}
      />

      <PortfolioImageManager
        portfolioId={portfolio.id}
        images={portfolio.images}
      />

      <PortfolioDocumentManager
        portfolioId={portfolio.id}
        documents={portfolio.documents}
      />

      <PortfolioRepositoryManager
        portfolioId={portfolio.id}
        repositories={portfolio.repositories}
      />

      <section className={styles.danger}>
        <div>
          <h2>Delete portfolio</h2>

          <p>Permanently remove this portfolio and its uploaded images.</p>
        </div>

        <PortfolioDeleteAction
          resource="portfolio"
          resourceId={portfolio.id}
          name={portfolio.name}
        />
      </section>
    </div>
  );
}
