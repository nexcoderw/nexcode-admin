import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import {
  Icon,
} from "@/components/ui/Icon/Icon";
import type {
  ContactPagination as ContactPaginationData,
} from "@/types/contact/contact";
import {
  buildContactListHref,
  type ResolvedContactListQuery,
} from "@/utils/contact/contact-page-query";

import styles from "./ContactPagination.module.css";

interface ContactPaginationProps {
  pagination: ContactPaginationData;
  query: ResolvedContactListQuery;
}

export function ContactPagination({
  pagination,
  query,
}: ContactPaginationProps) {
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
      aria-label="Message pagination"
    >
      <span
        className={
          styles.summary
        }
      >
        Page {pagination.page} of{" "}
        {pagination.totalPages}
        {" · "}
        {pagination.totalItems} messages
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
              buildContactListHref(
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
              buildContactListHref(
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