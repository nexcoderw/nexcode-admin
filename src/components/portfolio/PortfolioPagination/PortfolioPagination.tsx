import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import type { PortfolioPagination as PaginationData } from "@/types/portfolio/portfolio";
import {
  buildPortfolioListHref,
  type ResolvedPortfolioListQuery,
} from "@/utils/portfolio/portfolio-page-query";

import styles from "./PortfolioPagination.module.css";

interface PortfolioPaginationProps {
  pagination: PaginationData;

  query: ResolvedPortfolioListQuery;
}

export function PortfolioPagination({
  pagination,
  query,
}: PortfolioPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Portfolio pagination">
      <span className={styles.summary}>
        Page {pagination.page} of {pagination.totalPages}
        {" · "}
        {pagination.totalItems} portfolios
      </span>

      <div className={styles.controls}>
        {pagination.hasPrevious ? (
          <Link
            className={styles.control}
            href={buildPortfolioListHref(query, pagination.page - 1)}
          >
            <Icon icon={ArrowLeft01Icon} size={16} />
            Previous
          </Link>
        ) : (
          <span className={[styles.control, styles.disabled].join(" ")}>
            Previous
          </span>
        )}

        {pagination.hasNext ? (
          <Link
            className={styles.control}
            href={buildPortfolioListHref(query, pagination.page + 1)}
          >
            Next
            <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
        ) : (
          <span className={[styles.control, styles.disabled].join(" ")}>
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
