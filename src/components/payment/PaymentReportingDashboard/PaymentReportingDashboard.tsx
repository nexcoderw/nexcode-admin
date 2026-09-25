import type {
  PaymentReportOverview,
} from "@/types/payment/report";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./PaymentReportingDashboard.module.css";

interface PaymentReportingDashboardProps {
  overview:
    PaymentReportOverview;
}

export function PaymentReportingDashboard({
  overview,
}: PaymentReportingDashboardProps) {
  if (
    overview.currencies.length ===
    0
  ) {
    return (
      <section
        className={
          styles.empty
        }
      >
        No financial position is available for the selected filters.
      </section>
    );
  }

  return (
    <section
      className={
        styles.section
      }
      aria-label="Financial position"
    >
      {overview.currencies.map(
        (summary) => (
          <section
            key={
              summary.currency
            }
            className={
              styles.currency
            }
          >
            <header
              className={
                styles.currencyHeader
              }
            >
              <div>
                <span>
                  Financial position
                </span>

                <h2>
                  {summary.currency}
                </h2>
              </div>

              <small>
                {
                  summary.activeAgreementCount
                }{" "}
                active of{" "}
                {
                  summary.agreementCount
                }{" "}
                agreements · As of{" "}
                {formatPaymentDate(
                  overview.asOf,
                )}
              </small>
            </header>

            <div
              className={
                styles.metrics
              }
            >
              <article
                className={
                  styles.metric
                }
              >
                <span>
                  Contracted
                </span>

                <strong>
                  {formatPaymentMoney(
                    summary.totalContracted,
                    summary.currency,
                  )}
                </strong>
              </article>

              <article
                className={
                  styles.metric
                }
              >
                <span>
                  Received
                </span>

                <strong>
                  {formatPaymentMoney(
                    summary.totalReceived,
                    summary.currency,
                  )}
                </strong>
              </article>

              <article
                className={
                  styles.metric
                }
              >
                <span>
                  Outstanding
                </span>

                <strong>
                  {formatPaymentMoney(
                    summary.outstanding,
                    summary.currency,
                  )}
                </strong>
              </article>

              <article
                className={
                  styles.metric
                }
                data-critical={
                  Number(
                    summary.overdue,
                  ) > 0 ||
                  undefined
                }
              >
                <span>
                  Overdue
                </span>

                <strong>
                  {formatPaymentMoney(
                    summary.overdue,
                    summary.currency,
                  )}
                </strong>
              </article>

              <article
                className={
                  styles.metric
                }
              >
                <span>
                  Due within{" "}
                  {
                    overview.dueWithinDays
                  }{" "}
                  days
                </span>

                <strong>
                  {formatPaymentMoney(
                    summary.dueSoon,
                    summary.currency,
                  )}
                </strong>
              </article>
            </div>
          </section>
        ),
      )}
    </section>
  );
}