import {
  ArrowRight01Icon,
  Briefcase01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

import { PortfolioDeleteAction } from "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import type { PortfolioSummary } from "@/types/portfolio/portfolio";
import { getPortfolioImageSource } from "@/utils/portfolio/portfolio-image-source";
import {
  formatPortfolioDate,
  getPortfolioCategoryLabel,
  getPortfolioStatusLabel,
} from "@/utils/portfolio/portfolio-labels";

import styles from "./PortfolioCard.module.css";

interface PortfolioCardProps {
  portfolio: PortfolioSummary;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const image = getPortfolioImageSource(portfolio.coverImage?.image ?? null);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <Image
            src={image}
            alt={portfolio.coverImage?.altText || portfolio.name}
            fill
            sizes="(max-width: 52rem) 100vw, (max-width: 78rem) 50vw, 33vw"
            className={styles.image}
            unoptimized={image.startsWith("/api/portfolio/media")}
          />
        ) : (
          <div className={styles.fallback}>
            <Icon icon={Briefcase01Icon} size={32} />

            <span>No cover image</span>
          </div>
        )}

        <Badge
          variant={statusVariant(portfolio.status)}
          size="sm"
          className={styles.status}
        >
          {getPortfolioStatusLabel(portfolio.status)}
        </Badge>
      </div>

      <div className={styles.content}>
        <span className={styles.category}>
          {getPortfolioCategoryLabel(portfolio.category)}
        </span>

        <h2 className={styles.title}>{portfolio.name}</h2>

        <p className={styles.summary}>
          {portfolio.summary || "No summary provided."}
        </p>

        <dl className={styles.meta}>
          <div>
            <dt>Team</dt>
            <dd>{portfolio.teamMemberCount}</dd>
          </div>

          <div>
            <dt>Deadline</dt>
            <dd>{formatPortfolioDate(portfolio.deadlineDate)}</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <Button
            href={ROUTES.admin.portfolioDetail(portfolio.id)}
            variant="secondary"
            size="sm"
            leftIcon={<Icon icon={ArrowRight01Icon} size={16} />}
          >
            Details
          </Button>

          <Button
            href={ROUTES.admin.portfolioEdit(portfolio.id)}
            variant="ghost"
            size="sm"
            leftIcon={<Icon icon={File01Icon} size={16} />}
          >
            Edit
          </Button>

          <PortfolioDeleteAction
            resource="portfolio"
            resourceId={portfolio.id}
            name={portfolio.name}
            compact
          />
        </div>
      </div>

      <footer className={styles.footer}>
        <span>@{portfolio.slug}</span>

        <span>Updated {formatPortfolioDate(portfolio.updatedAt)}</span>
      </footer>
    </article>
  );
}

function statusVariant(status: PortfolioSummary["status"]) {
  if (status === "published") {
    return "success";
  }

  if (status === "archived") {
    return "warning";
  }

  return "neutral";
}
