import type {
  PaymentCurrency,
} from "@/types/payment/shared";
import type {
  AgreementFinancialSummary,
} from "@/types/payment/summary";
import {
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./PaymentSummaryCards.module.css";

interface PaymentSummaryCardsProps {
  summary:
    AgreementFinancialSummary;

  currency:
    PaymentCurrency;
}

export function PaymentSummaryCards({
  summary,
  currency,
}: PaymentSummaryCardsProps) {
  const cards = [
    {
      label:
        "Contract value",

      value:
        summary.totalAmount,
    },
    {
      label:
        "Received",

      value:
        summary.receivedAmount,
    },
    {
      label:
        "Outstanding",

      value:
        summary.outstandingAmount,
    },
    {
      label:
        "Unallocated",

      value:
        summary.unallocatedAmount,
    },
  ];

  return (
    <section
      className={
        styles.grid
      }
      aria-label="Agreement financial summary"
    >
      {cards.map(
        (card) => (
          <article
            key={
              card.label
            }
            className={
              styles.card
            }
          >
            <span>
              {card.label}
            </span>

            <strong>
              {formatPaymentMoney(
                card.value,
                currency,
              )}
            </strong>
          </article>
        ),
      )}
    </section>
  );
}
