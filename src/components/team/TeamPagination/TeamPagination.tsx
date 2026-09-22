import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import type { TeamPagination as PaginationData } from "@/types/team/team";
import {
  buildTeamListHref,
  type ResolvedTeamListQuery,
} from "@/utils/team/team-list-query";

import styles from "./TeamPagination.module.css";

interface TeamPaginationProps {
  pagination: PaginationData;
  query: ResolvedTeamListQuery;
}

export function TeamPagination({ pagination, query }: TeamPaginationProps) {
  if (
    pagination.totalItems <= pagination.pageSize ||
    pagination.totalPages <= 1
  ) {
    return null;
  }

  const start = (pagination.page - 1) * pagination.pageSize + 1;

  const end = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalItems,
  );

  return (
    <nav className={styles.pagination} aria-label={"Team pagination"}>
      <p className={styles.summary}>
        Showing {start}–{end} of {pagination.totalItems}
      </p>

      <div className={styles.controls}>
        {pagination.hasPrevious ? (
          <Link
            href={buildTeamListHref(query, pagination.page - 1)}
            className={styles.control}
          >
            <Icon icon={ArrowLeft01Icon} size={16} />
            Previous
          </Link>
        ) : (
          <span className={[styles.control, styles.disabled].join(" ")}>
            <Icon icon={ArrowLeft01Icon} size={16} />
            Previous
          </span>
        )}

        <span className={styles.page}>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        {pagination.hasNext ? (
          <Link
            href={buildTeamListHref(query, pagination.page + 1)}
            className={styles.control}
          >
            Next
            <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
        ) : (
          <span className={[styles.control, styles.disabled].join(" ")}>
            Next
            <Icon icon={ArrowRight01Icon} size={16} />
          </span>
        )}
      </div>
    </nav>
  );
}
