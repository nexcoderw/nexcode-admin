import {
  File01Icon,
} from "@hugeicons/core-free-icons";

import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import type {
  PaymentCollectionsReport,
} from "@/types/payment/report";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";
import {
  buildPaymentReportCsvHref,
  type ResolvedPaymentReportQuery,
} from "@/utils/payment/report-query";

import styles from "./PaymentCollectionsTable.module.css";

interface PaymentCollectionsTableProps {
  report:
    PaymentCollectionsReport;

  query:
    ResolvedPaymentReportQuery;
}

export function PaymentCollectionsTable({
  report,
  query,
}: PaymentCollectionsTableProps) {
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
            Collections
          </span>

          <h2>
            Monthly received payments
          </h2>
        </div>

        <Button
          href={
            buildPaymentReportCsvHref(
              "collections",
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
          No posted payments match this reporting period.
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
                  Month
                </th>

                <th>
                  Currency
                </th>

                <th>
                  Received
                </th>

                <th>
                  Payments
                </th>
              </tr>
            </thead>

            <tbody>
              {report.rows.map(
                (row) => (
                  <tr
                    key={
                      `${row.month}-${row.currency}`
                    }
                  >
                    <td>
                      {formatPaymentDate(
                        row.month,
                      )}
                    </td>

                    <td>
                      {row.currency}
                    </td>

                    <td>
                      {formatPaymentMoney(
                        row.amount,
                        row.currency,
                      )}
                    </td>

                    <td>
                      {
                        row.paymentCount
                      }
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