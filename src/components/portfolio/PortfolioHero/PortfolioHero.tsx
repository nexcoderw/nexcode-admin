import { Briefcase01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

import { Badge } from "@/components/ui/Badge/Badge";
import { Icon } from "@/components/ui/Icon/Icon";
import type { PortfolioDetail } from "@/types/portfolio/portfolio";
import { getPortfolioImageSource } from "@/utils/portfolio/portfolio-image-source";
import {
  getPortfolioCategoryLabel,
  getPortfolioStatusLabel,
} from "@/utils/portfolio/portfolio-labels";

import styles from "./PortfolioHero.module.css";

interface PortfolioHeroProps {
  portfolio: PortfolioDetail;
}

export function PortfolioHero({ portfolio }: PortfolioHeroProps) {
  // The marked cover leads; otherwise the first image stands in for it.
  const cover =
    portfolio.images.find((image) => image.isCover) ?? portfolio.images[0];

  const source = getPortfolioImageSource(cover?.image ?? null);

  return (
    <section className={styles.hero} data-plain={source ? undefined : true}>
      <div className={styles.media}>
        {source ? (
          <Image
            src={source}
            alt={cover?.altText || portfolio.name}
            fill
            priority
            sizes="(max-width: 64rem) 100vw, 64rem"
            className={styles.image}
            unoptimized={source.startsWith("/api/portfolio/media")}
          />
        ) : (
          <span className={styles.mark} aria-hidden="true">
            <Icon icon={Briefcase01Icon} size={34} />
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.tags}>
          <Badge
            variant={portfolio.status === "published" ? "success" : "neutral"}
            size="sm"
          >
            {getPortfolioStatusLabel(portfolio.status)}
          </Badge>

          <span className={styles.category}>
            {getPortfolioCategoryLabel(portfolio.category)}
          </span>
        </div>

        <h1 className={styles.title}>{portfolio.name}</h1>

        <p className={styles.summary}>
          {portfolio.summary || "No project summary provided."}
        </p>

        <span className={styles.slug}>@{portfolio.slug}</span>
      </div>
    </section>
  );
}
