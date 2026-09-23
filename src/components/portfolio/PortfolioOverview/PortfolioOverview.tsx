import type { PortfolioDetail } from "@/types/portfolio/portfolio";
import {
  formatPortfolioDate,
  getPortfolioCategoryLabel,
  getPortfolioProjectTypeLabel,
} from "@/utils/portfolio/portfolio-labels";

import styles from "./PortfolioOverview.module.css";

interface PortfolioOverviewProps {
  portfolio: PortfolioDetail;
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  return (
    <section className={styles.overview}>
      <dl>
        <div>
          <dt>Category</dt>
          <dd>{getPortfolioCategoryLabel(portfolio.category)}</dd>
        </div>

        <div>
          <dt>Project type</dt>
          <dd>{getPortfolioProjectTypeLabel(portfolio.projectType)}</dd>
        </div>

        <div>
          <dt>Initiated</dt>
          <dd>{formatPortfolioDate(portfolio.projectInitiationDate)}</dd>
        </div>

        <div>
          <dt>Deadline</dt>
          <dd>{formatPortfolioDate(portfolio.deadlineDate)}</dd>
        </div>
      </dl>

      {portfolio.description && (
        <div className={styles.description}>
          <h2>Description</h2>

          <p>{portfolio.description}</p>
        </div>
      )}
    </section>
  );
}
