import { PortfolioCard } from "@/components/portfolio/PortfolioCard/PortfolioCard";
import type { PortfolioSummary } from "@/types/portfolio/portfolio";

import styles from "./PortfolioGrid.module.css";

interface PortfolioGridProps {
  items: PortfolioSummary[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <section className={styles.grid} aria-label="Portfolios">
      {items.map((portfolio) => (
        <PortfolioCard key={portfolio.id} portfolio={portfolio} />
      ))}
    </section>
  );
}
