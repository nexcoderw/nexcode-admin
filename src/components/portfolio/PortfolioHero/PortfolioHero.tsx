import Image from "next/image";

import { Badge } from "@/components/ui/Badge/Badge";
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

/**
 * The page's opening: status, title and summary set as type, then the
 * cover beneath. With no images the cover is simply omitted rather
 * than replaced by a placeholder.
 */
export function PortfolioHero({ portfolio }: PortfolioHeroProps) {
  const cover =
    portfolio.images.find((image) => image.isCover) ?? portfolio.images[0];

  const source = getPortfolioImageSource(cover?.image ?? null);

  return (
    <header className={styles.hero}>
      <div className={styles.intro}>
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

        {portfolio.summary && (
          <p className={styles.summary}>{portfolio.summary}</p>
        )}
      </div>

      {source && (
        <figure className={styles.cover}>
          <Image
            src={source}
            alt={cover?.altText || portfolio.name}
            fill
            priority
            sizes="(max-width: 76rem) 100vw, 76rem"
            className={styles.image}
            unoptimized={source.startsWith("/api/portfolio/media")}
          />
        </figure>
      )}
    </header>
  );
}
