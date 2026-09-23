import { ArrowLeft01Icon, File01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PortfolioDeleteAction } from "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero/PortfolioHero";
import { PortfolioImageGallery } from "@/components/portfolio/PortfolioImageGallery/PortfolioImageGallery";
import { PortfolioLinkSection } from "@/components/portfolio/PortfolioLinkSection/PortfolioLinkSection";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview/PortfolioOverview";
import { PortfolioTeamSection } from "@/components/portfolio/PortfolioTeamSection/PortfolioTeamSection";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { getPortfolio } from "@/endpoints/portfolio/get-portfolio";
import { parsePortfolioResourceId } from "@/utils/portfolio/portfolio-id";
import { getPortfolioServerContext } from "@/utils/portfolio/portfolio-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Portfolio Details",
};

interface PortfolioDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PortfolioDetailsPage({
  params,
}: PortfolioDetailsPageProps) {
  const context = await getPortfolioServerContext();

  if (!context) {
    redirect(ROUTES.auth.login);
  }

  const { id } = await params;

  const portfolioId = parsePortfolioResourceId(id);

  if (!portfolioId) {
    notFound();
  }

  const result = await getPortfolio(
    portfolioId,
    context.sessionId,
    context.forwarded,
  );

  if (result.status === 404) {
    notFound();
  }

  if (result.status === 401 || result.status === 403) {
    redirect(ROUTES.auth.login);
  }

  if (!result.ok || !result.portfolio) {
    throw new Error("Portfolio unavailable.");
  }

  const portfolio = result.portfolio;

  return (
    <div className={styles.page}>
      <nav className={styles.bar} aria-label="Portfolio actions">
        <Button
          href={ROUTES.admin.portfolios}
          variant="ghost"
          leftIcon={<Icon icon={ArrowLeft01Icon} size={17} />}
        >
          Portfolios
        </Button>

        <div className={styles.barActions}>
          <Button
            href={ROUTES.admin.portfolioEdit(portfolio.id)}
            variant="secondary"
            leftIcon={<Icon icon={File01Icon} size={17} />}
          >
            Edit portfolio
          </Button>

          <PortfolioDeleteAction
            resource="portfolio"
            resourceId={portfolio.id}
            name={portfolio.name}
          />
        </div>
      </nav>

      <PortfolioHero portfolio={portfolio} />

      <PortfolioOverview portfolio={portfolio} />

      <PortfolioImageGallery
        images={portfolio.images}
        portfolioName={portfolio.name}
      />

      <PortfolioTeamSection members={portfolio.teamMembers} />

      {/* Documents and repositories sit side by side: both are short lists. */}
      <div className={styles.links}>
        <PortfolioLinkSection
          title="Documents"
          links={portfolio.documents.map((document) => ({
            id: document.id,
            label: document.title,
            url: document.url,
          }))}
          emptyMessage="No document links have been added yet."
        />

        <PortfolioLinkSection
          title="Repositories"
          links={portfolio.repositories.map((repository) => ({
            id: repository.id,
            label: repository.label,
            url: repository.url,
          }))}
          emptyMessage="No repositories have been linked yet."
        />
      </div>
    </div>
  );
}
