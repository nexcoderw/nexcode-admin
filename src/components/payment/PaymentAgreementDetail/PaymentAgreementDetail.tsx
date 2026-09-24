import {
  Badge,
} from "@/components/ui/Badge/Badge";
import type {
  PaymentAgreement,
} from "@/types/payment/agreement";
import {
  agreementStatusLabel,
  agreementTypeLabel,
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./PaymentAgreementDetail.module.css";

interface PaymentAgreementDetailProps {
  agreement:
    PaymentAgreement;
}

export function PaymentAgreementDetail({
  agreement,
}: PaymentAgreementDetailProps) {
  const facts = [
    {
      label:
        "Portfolio",

      value:
        agreement
          .portfolio.name,
    },
    {
      label:
        "Reference",

      value:
        agreement.reference ??
        "Not set",
    },
    {
      label:
        "Type",

      value:
        agreementTypeLabel(
          agreement
            .agreementType,
        ),
    },
    {
      label:
        "Currency",

      value:
        agreement.currency,
    },
    {
      label:
        "Contract value",

      value:
        formatPaymentMoney(
          agreement.totalAmount,
          agreement.currency,
        ),
    },
    {
      label:
        "Agreement date",

      value:
        formatPaymentDate(
          agreement
            .agreementDate,
        ),
    },
    {
      label:
        "Start date",

      value:
        formatPaymentDate(
          agreement.startDate,
        ),
    },
    {
      label:
        "End date",

      value:
        formatPaymentDate(
          agreement.endDate,
        ),
    },
  ];

  return (
    <section
      className={
        styles.panel
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <span>
            Agreement
          </span>

          <h1>
            {agreement.title}
          </h1>
        </div>

        <Badge
          variant={
            agreement.status ===
            "active"
              ? "success"
              : agreement.status ===
                  "cancelled"
                ? "error"
                : "neutral"
          }
        >
          {agreementStatusLabel(
            agreement.status,
          )}
        </Badge>
      </header>

      <dl
        className={
          styles.facts
        }
      >
        {facts.map(
          (fact) => (
            <div
              key={
                fact.label
              }
            >
              <dt>
                {fact.label}
              </dt>

              <dd>
                {fact.value}
              </dd>
            </div>
          ),
        )}
      </dl>

      {agreement.notes && (
        <div
          className={
            styles.notes
          }
        >
          <span>
            Notes
          </span>

          <p>
            {agreement.notes}
          </p>
        </div>
      )}
    </section>
  );
}