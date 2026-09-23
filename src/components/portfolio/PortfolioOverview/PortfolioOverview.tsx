import type { PortfolioDetail } from "@/types/portfolio/portfolio";
import {
  formatPortfolioDate,
  getPortfolioProjectTypeLabel,
} from "@/utils/portfolio/portfolio-labels";

import styles from "./PortfolioOverview.module.css";

interface PortfolioOverviewProps {
  portfolio: PortfolioDetail;
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  const facts = [
    {
      term: "Project type",
      value: getPortfolioProjectTypeLabel(portfolio.projectType),
    },
    {
      term: "Initiated",
      value: formatPortfolioDate(portfolio.projectInitiationDate),
    },
    {
      term: "Deadline",
      value: formatPortfolioDate(portfolio.deadlineDate),
    },
    {
      term: "Team",
      value: `${portfolio.teamMembers.length}`,
    },
  ];

  return (
    <section className={styles.overview}>
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt>{fact.term}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {portfolio.description && (
        <div className={styles.description}>
          <h2>About this project</h2>

          <p>{portfolio.description}</p>
        </div>
      )}

      {(portfolio.liveUrl || portfolio.figmaUrl) && (
        <div className={styles.quickLinks}>
          {portfolio.liveUrl && (
            <a href={portfolio.liveUrl} target="_blank" rel="noreferrer">
              Visit live site
            </a>
          )}

          {portfolio.figmaUrl && (
            <a href={portfolio.figmaUrl} target="_blank" rel="noreferrer">
              Open Figma file
            </a>
          )}
        </div>
      )}
    </section>
  );
}
