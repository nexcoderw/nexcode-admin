import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import {
  Icon,
} from "@/components/ui/Icon/Icon";
import type {
  ClientPagination as ClientPaginationData,
} from "@/types/client/client";
import {
  buildClientListHref,
  type ResolvedClientListQuery,
} from "@/utils/client/client-page-query";

import styles from "./ClientPagination.module.css";

interface ClientPaginationProps {
  pagination: ClientPaginationData;
  query: ResolvedClientListQuery;
}

export function ClientPagination({
  pagination,
  query,
}: ClientPaginationProps) {
  if (
    pagination.totalPages <= 1
  ) {
    return null;
  }

  return (
    <nav
      className={
        styles.pagination
      }
      aria-label="Client pagination"
    >
      <span
        className={
          styles.summary
        }
      >
        Page {pagination.page} of{" "}
        {pagination.totalPages}
        {" · "}
        {pagination.totalItems} clients
      </span>

      <div
        className={
          styles.controls
        }
      >
        {pagination.hasPrevious ? (
          <Link
            className={
              styles.control
            }
            href={
              buildClientListHref(
                query,
                pagination.page - 1,
              )
            }
          >
            <Icon
              icon={
                ArrowLeft01Icon
              }
              size={16}
            />

            Previous
          </Link>
        ) : (
          <span
            className={[
              styles.control,
              styles.disabled,
            ].join(" ")}
          >
            Previous
          </span>
        )}

        {pagination.hasNext ? (
          <Link
            className={
              styles.control
            }
            href={
              buildClientListHref(
                query,
                pagination.page + 1,
              )
            }
          >
            Next

            <Icon
              icon={
                ArrowRight01Icon
              }
              size={16}
            />
          </Link>
        ) : (
          <span
            className={[
              styles.control,
              styles.disabled,
            ].join(" ")}
          >
            Next
          </span>
        )}
      </div>
    </nav>
  );
}