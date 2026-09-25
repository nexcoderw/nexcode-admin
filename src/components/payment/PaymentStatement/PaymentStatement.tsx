import {
  Badge,
} from "@/components/ui/Badge/Badge";
import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import type {
  PaymentPortfolioStatement,
} from "@/types/payment/report";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./PaymentStatement.module.css";

interface PaymentStatementProps {
  statement:
    PaymentPortfolioStatement;
}

export function PaymentStatement({
  statement,
}: PaymentStatementProps) {
  return (
    <article
      className={
        styles.statement
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <span>
            NEXCODE LTD
          </span>

          <h1>
            Payment statement
          </h1>

          <p>
            {
              statement
                .portfolio
                .name
            }
          </p>
        </div>

        <small>
          Generated{" "}
          {formatPaymentDate(
            statement.generatedAt,
          )}
        </small>
      </header>

      <section
        className={
          styles.summaries
        }
      >
        {statement.currencies.map(
          (summary) => (
            <div
              key={
                summary.currency
              }
              className={
                styles.summary
              }
            >
              <strong>
                {summary.currency}
              </strong>

              <dl>
                <div>
                  <dt>
                    Contracted
                  </dt>

                  <dd>
                    {formatPaymentMoney(
                      summary.totalContracted,
                      summary.currency,
                    )}
                  </dd>
                </div>

                <div>
                  <dt>
                    Received
                  </dt>

                  <dd>
                    {formatPaymentMoney(
                      summary.totalReceived,
                      summary.currency,
                    )}
                  </dd>
                </div>

                <div>
                  <dt>
                    Outstanding
                  </dt>

                  <dd>
                    {formatPaymentMoney(
                      summary.outstanding,
                      summary.currency,
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ),
        )}
      </section>

      <section>
        <h2>
          Agreements
        </h2>

        <div
          className={
            styles.tableWrap
          }
        >
          <table
            className={
              styles.table
            }
          >
            <thead>
              <tr>
                <th>
                  Agreement
                </th>

                <th>
                  Status
                </th>

                <th>
                  Value
                </th>

                <th>
                  Received
                </th>

                <th>
                  Outstanding
                </th>
              </tr>
            </thead>

            <tbody>
              {statement.agreements.map(
                (agreement) => (
                  <tr
                    key={
                      agreement.id
                    }
                  >
                    <td>
                      {
                        agreement.title
                      }
                    </td>

                    <td>
                      <Badge
                        size="sm"
                        variant={
                          agreement.status ===
                          "cancelled"
                            ? "error"
                            : agreement.status ===
                                "active"
                              ? "success"
                              : "neutral"
                        }
                      >
                        {
                          agreement.status
                        }
                      </Badge>
                    </td>

                    <td>
                      {formatPaymentMoney(
                        agreement.totalAmount,
                        agreement.currency,
                      )}
                    </td>

                    <td>
                      {formatPaymentMoney(
                        agreement.receivedAmount,
                        agreement.currency,
                      )}
                    </td>

                    <td>
                      {formatPaymentMoney(
                        agreement.outstandingAmount,
                        agreement.currency,
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>
          Transactions
        </h2>

        <div
          className={
            styles.tableWrap
          }
        >
          <table
            className={
              styles.table
            }
          >
            <thead>
              <tr>
                <th>
                  Receipt
                </th>

                <th>
                  Date
                </th>

                <th>
                  Agreement
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {statement.payments.map(
                (payment) => (
                  <tr
                    key={
                      payment.id
                    }
                  >
                    <td>
                      <a
                        href={
                          PAYMENT_ROUTES.receipt(
                            payment.id,
                          )
                        }
                      >
                        {
                          payment
                            .receiptNumber
                        }
                      </a>
                    </td>

                    <td>
                      {formatPaymentDate(
                        payment.paidAt,
                      )}
                    </td>

                    <td>
                      {
                        payment
                          .agreementTitle
                      }
                    </td>

                    <td>
                      {formatPaymentMoney(
                        payment.amount,
                        payment.currency,
                      )}
                    </td>

                    <td>
                      {
                        payment.status
                      }
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}