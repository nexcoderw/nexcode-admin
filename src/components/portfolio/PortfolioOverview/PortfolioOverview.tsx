import { LinkSquare02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/ui/Icon/Icon";
import type { PortfolioDetail } from "@/types/portfolio/portfolio";
import {
  formatPortfolioDate,
  getPortfolioProjectTypeLabel,
} from "@/utils/portfolio/portfolio-labels";

import styles from "./PortfolioOverview.module.css";

interface PortfolioOverviewProps {
  portfolio: PortfolioDetail;
}

/**
 * The project's facts as a ledger: one row per fact, label on the left,
 * value on the right, followed by the project's own outbound links.
 */
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
      term: "Published",
      value: formatPortfolioDate(portfolio.publishedAt),
    },
    {
      term: "Last updated",
      value: formatPortfolioDate(portfolio.updatedAt),
    },
    {
      term: "Slug",
      value: portfolio.slug,
    },
  ];

  const links = [
    { label: "Live site", url: portfolio.liveUrl },
    { label: "Figma file", url: portfolio.figmaUrl },
  ].filter((link): link is { label: string; url: string } =>
    Boolean(link.url),
  );

  return (
    <section className={styles.overview} aria-label="Project facts">
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt>{fact.term}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {links.length > 0 && (
        <div className={styles.links}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}

              <Icon icon={LinkSquare02Icon} size={15} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
