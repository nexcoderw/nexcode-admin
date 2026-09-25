import {
  File01Icon,
} from "@hugeicons/core-free-icons";

import {
  Badge,
} from "@/components/ui/Badge/Badge";
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
  PaymentOutstandingReport,
} from "@/types/payment/report";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";
import {
  buildPaymentReportCsvHref,
  type ResolvedPaymentReportQuery,
} from "@/utils/payment/report-query";

import styles from "./PaymentOutstandingTable.module.css";

interface PaymentOutstandingTableProps {
  report:
    PaymentOutstandingReport;

  query:
    ResolvedPaymentReportQuery;
}

export function PaymentOutstandingTable({
  report,
  query,
}: PaymentOutstandingTableProps) {
  return (
    <section
      className={
        styles.section
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <span>
            Receivables
          </span>

          <h2>
            Outstanding obligations
          </h2>
        </div>

        <Button
          href={
            buildPaymentReportCsvHref(
              "outstanding",
              query,
            )
          }
          size="sm"
          variant="secondary"
          leftIcon={
            <Icon
              icon={
                File01Icon
              }
              size={16}
            />
          }
        >
          Export CSV
        </Button>
      </header>

      {report.rows.length ===
      0 ? (
        <div
          className={
            styles.empty
          }
        >
          No outstanding obligations match these filters.
        </div>
      ) : (
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
                  Portfolio
                </th>

                <th>
                  Installment
                </th>

                <th>
                  Due
                </th>

                <th>
                  Outstanding
                </th>

                <th>
                  Status
                </th>

                <th>
                  Statement
                </th>
              </tr>
            </thead>

            <tbody>
              {report.rows.map(
                (row) => (
                  <tr
                    key={
                      row.installmentId
                    }
                  >
                    <td>
                      <strong>
                        {
                          row
                            .portfolio
                            .name
                        }
                      </strong>

                      <span>
                        {
                          row
                            .agreementTitle
                        }
                      </span>
                    </td>

                    <td>
                      {row.title}
                    </td>

                    <td>
                      {formatPaymentDate(
                        row.effectiveDueDate,
                      )}
                    </td>

                    <td>
                      {formatPaymentMoney(
                        row.outstandingAmount,
                        row.currency,
                      )}
                    </td>

                    <td>
                      <Badge
                        size="sm"
                        variant={
                          row.timingState ===
                          "overdue"
                            ? "error"
                            : row.timingState ===
                                "due_today"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {row.timingState
                          .replaceAll(
                            "_",
                            " ",
                          )}
                      </Badge>
                    </td>

                    <td>
                      <Button
                        href={
                          PAYMENT_ROUTES.statement(
                            row.portfolio.id,
                          )
                        }
                        size="sm"
                        variant="ghost"
                        iconOnly
                        leftIcon={
                          <Icon
                            icon={
                              File01Icon
                            }
                            size={16}
                          />
                        }
                        aria-label={
                          `View ${row.portfolio.name} statement`
                        }
                      >
                        View statement
                      </Button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}