import {
  Alert,
} from "@/components/ui/Alert/Alert";
import type {
  PaymentReceipt as Receipt,
} from "@/types/payment/report";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./PaymentReceipt.module.css";

interface PaymentReceiptProps {
  receipt: Receipt;
}

export function PaymentReceipt({
  receipt,
}: PaymentReceiptProps) {
  const payment =
    receipt.payment;

  return (
    <article
      className={
        styles.receipt
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
            Payment receipt
          </h1>
        </div>

        <strong>
          {
            receipt
              .receiptNumber
          }
        </strong>
      </header>

      {payment.status ===
        "voided" && (
        <Alert
          variant="error"
          title="Voided receipt"
        >
          {payment.voidReason ??
            "This transaction has been voided."}
        </Alert>
      )}

      <dl
        className={
          styles.details
        }
      >
        {[
          [
            "Portfolio",
            receipt
              .portfolio.name,
          ],
          [
            "Agreement",
            receipt
              .agreement.title,
          ],
          [
            "Agreement reference",
            receipt
              .agreement
              .reference ??
              "Not set",
          ],
          [
            "Payment date",
            formatPaymentDate(
              payment.paidAt,
            ),
          ],
          [
            "Amount",
            formatPaymentMoney(
              payment.amount,
              payment.currency,
            ),
          ],
          [
            "Method",
            payment
              .paymentMethod
              .replaceAll(
                "_",
                " ",
              ),
          ],
          [
            "Transaction reference",
            payment.reference ??
              "Not set",
          ],
          [
            "Recorded by",
            payment.recordedBy ??
              "Not recorded",
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
                {value}
              </dd>
            </div>
          ),
        )}
      </dl>

      <section
        className={
          styles.allocations
        }
      >
        <h2>
          Allocation
        </h2>

        {receipt.allocations.length ===
        0 ? (
          <p>
            This payment was recorded without installment allocation.
          </p>
        ) : (
          <ul>
            {receipt.allocations.map(
              (
                allocation,
              ) => (
                <li
                  key={
                    allocation
                      .installmentId
                  }
                >
                  <span>
                    {
                      allocation
                        .installmentTitle
                    }
                  </span>

                  <strong>
                    {formatPaymentMoney(
                      allocation.amount,
                      payment.currency,
                    )}
                  </strong>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <footer
        className={
          styles.footer
        }
      >
        Generated{" "}
        {formatPaymentDate(
          receipt.issuedAt,
        )}
      </footer>
    </article>
  );
}