import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import type {
  PaymentAgreementListData,
} from "@/types/payment/agreement";
import {
  buildPaymentListHref,
  type ResolvedPaymentAgreementQuery,
} from "@/utils/payment/payment-page-query";

import {
  PaymentAgreementCard,
} from "../PaymentAgreementCard/PaymentAgreementCard";

import styles from "./PaymentAgreementList.module.css";

interface PaymentAgreementListProps {
  data:
    PaymentAgreementListData;

  query:
    ResolvedPaymentAgreementQuery;

  filtered: boolean;
}

export function PaymentAgreementList({
  data,
  query,
  filtered,
}: PaymentAgreementListProps) {
  if (
    data.items.length === 0
  ) {
    return (
      <section
        className={
          styles.empty
        }
      >
        <span
          className={
            styles.emptyIcon
          }
        >
          <Icon
            icon={
              File01Icon
            }
            size={26}
          />
        </span>

        <h2>
          {filtered
            ? "No matching agreements"
            : "No payment agreements yet"}
        </h2>

        <p>
          {filtered
            ? "Change or reset the active payment filters."
            : "Create the first payment agreement for a portfolio."}
        </p>

        <Button
          href={
            filtered
              ? PAYMENT_ROUTES.list
              : PAYMENT_ROUTES.add
          }
          variant={
            filtered
              ? "secondary"
              : "primary"
          }
          leftIcon={
            <Icon
              icon={
                File01Icon
              }
              size={17}
            />
          }
        >
          {filtered
            ? "Reset filters"
            : "Add agreement"}
        </Button>
      </section>
    );
  }

  return (
    <>
      <section
        className={
          styles.grid
        }
        aria-label="Payment agreements"
      >
        {data.items.map(
          (agreement) => (
            <PaymentAgreementCard
              key={
                agreement.id
              }
              agreement={
                agreement
              }
            />
          ),
        )}
      </section>

      {data.pagination
        .totalPages > 1 && (
        <nav
          className={
            styles.pagination
          }
          aria-label="Payment agreement pagination"
        >
          <span>
            Page{" "}
            {
              data.pagination
                .page
            }{" "}
            of{" "}
            {
              data.pagination
                .totalPages
            }
            {" · "}
            {
              data.pagination
                .totalItems
            }{" "}
            agreements
          </span>

          <div>
            {data.pagination
              .hasPrevious ? (
              <Link
                className={
                  styles.control
                }
                href={
                  buildPaymentListHref(
                    query,
                    data.pagination
                      .page - 1,
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

            {data.pagination
              .hasNext ? (
              <Link
                className={
                  styles.control
                }
                href={
                  buildPaymentListHref(
                    query,
                    data.pagination
                      .page + 1,
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
      )}
    </>
  );
}