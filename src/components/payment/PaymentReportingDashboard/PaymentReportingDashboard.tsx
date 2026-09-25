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
      <header
        className={
          styles.header
        }
      >
        <div>
          <span>
            Position
          </span>

          <h2>
            Financial overview
          </h2>
        </div>

        <small>
          As of{" "}
          {formatPaymentDate(
            overview.asOf,
          )}
        </small>
      </header>

      <div
        className={
          styles.currencies
        }
      >
        {overview.currencies.map(
          (summary) => (
            <article
              key={
                summary.currency
              }
              className={
                styles.currency
              }
            >
              <header>
                <strong>
                  {summary.currency}
                </strong>

                <span>
                  {
                    summary
                      .activeAgreementCount
                  }{" "}
                  active of{" "}
                  {
                    summary
                      .agreementCount
                  }{" "}
                  agreements
                </span>
              </header>

              <dl
                className={
                  styles.metrics
                }
              >
                {[
                  [
                    "Contracted",
                    summary.totalContracted,
                  ],
                  [
                    "Received",
                    summary.totalReceived,
                  ],
                  [
                    "Outstanding",
                    summary.outstanding,
                  ],
                  [
                    "Overdue",
                    summary.overdue,
                  ],
                  [
                    `Due within ${overview.dueWithinDays} days`,
                    summary.dueSoon,
                  ],
                ].map(
                  ([
                    label,
                    value,
                  ]) => (
                    <div
                      key={
                        label
                      }
                    >
                      <dt>
                        {label}
                      </dt>

                      <dd>
                        {formatPaymentMoney(
                          value,
                          summary.currency,
                        )}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            </article>
          ),
        )}
      </div>
    </section>
  );
}