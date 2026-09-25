import { Badge } from "@/components/ui/Badge/Badge";
import type { PaymentRecord } from "@/types/payment/record";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";
import { File01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";

import styles from "./PaymentRecordList.module.css";

interface PaymentRecordListProps {
  records: PaymentRecord[];
}

export function PaymentRecordList({ records }: PaymentRecordListProps) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <span>Ledger</span>

          <h2>Received payments</h2>
        </div>

        <strong>{records.length}</strong>
      </header>

      {records.length === 0 ? (
        <div className={styles.empty}>
          No transactions have been recorded yet.
        </div>
      ) : (
        <div className={styles.list}>
          {records.map((payment) => (
            <article key={payment.id} className={styles.record}>
              <div className={styles.primary}>
                <div>
                  <strong>
                    {formatPaymentMoney(payment.amount, payment.currency)}
                  </strong>

                  <span>{formatPaymentDate(payment.paidAt)}</span>
                </div>

                <Badge
                  size="sm"
                  variant={payment.status === "voided" ? "error" : "success"}
                >
                  {payment.status}
                </Badge>
              </div>

              <dl className={styles.meta}>
                <div>
                  <dt>Method</dt>

                  <dd>{payment.paymentMethod.replaceAll("_", " ")}</dd>
                </div>

                <div>
                  <dt>Reference</dt>

                  <dd>{payment.reference ?? "Not set"}</dd>
                </div>

                <div>
                  <dt>Allocations</dt>

                  <dd>{payment.allocations.length}</dd>
                </div>
              </dl>

              {payment.allocations.length > 0 && (
                <ul className={styles.allocations}>
                  {payment.allocations.map((allocation) => (
                    <li key={allocation.id}>
                      <span>{allocation.installmentTitle}</span>

                      <strong>
                        {formatPaymentMoney(
                          allocation.amount,
                          payment.currency,
                        )}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
          <footer className={styles.recordActions}>
            <Button
              href={PAYMENT_ROUTES.receipt(payment.id)}
              size="sm"
              variant="ghost"
              leftIcon={<Icon icon={File01Icon} size={16} />}
            >
              Receipt
            </Button>
          </footer>
        </div>
      )}
    </section>
  );
}
