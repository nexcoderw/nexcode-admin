import {
  Badge,
} from "@/components/ui/Badge/Badge";
import type {
  PaymentInstallment,
} from "@/types/payment/installment";
import type {
  PaymentCurrency,
} from "@/types/payment/shared";
import {
  formatPaymentDate,
  formatPaymentMoney,
  installmentTypeLabel,
} from "@/utils/payment/payment-format";

import styles from "./PaymentInstallmentTimeline.module.css";

interface PaymentInstallmentTimelineProps {
  installments:
    PaymentInstallment[];

  currency:
    PaymentCurrency;
}

export function PaymentInstallmentTimeline({
  installments,
  currency,
}: PaymentInstallmentTimelineProps) {
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
            Schedule
          </span>

          <h2>
            Payment timeline
          </h2>
        </div>

        <strong>
          {installments.length}
        </strong>
      </header>

      {installments.length ===
      0 ? (
        <div
          className={
            styles.empty
          }
        >
          No installment schedule has been created yet.
        </div>
      ) : (
        <ol
          className={
            styles.timeline
          }
        >
          {installments.map(
            (installment) => (
              <li
                key={
                  installment.id
                }
                className={
                  styles.item
                }
              >
                <span
                  className={
                    styles.sequence
                  }
                >
                  {
                    installment.sequence
                  }
                </span>

                <div
                  className={
                    styles.content
                  }
                >
                  <div
                    className={
                      styles.itemHeader
                    }
                  >
                    <div>
                      <h3>
                        {
                          installment.title
                        }
                      </h3>

                      <span>
                        {installmentTypeLabel(
                          installment
                            .installmentType,
                        )}
                      </span>
                    </div>

                    <Badge
                      size="sm"
                      variant={
                        paymentVariant(
                          installment
                            .financial
                            .paymentState,
                        )
                      }
                    >
                      {
                        installment
                          .financial
                          .paymentState
                      }
                    </Badge>
                  </div>

                  <div
                    className={
                      styles.money
                    }
                  >
                    <strong>
                      {formatPaymentMoney(
                        installment.amount,
                        currency,
                      )}
                    </strong>

                    <span>
                      {
                        installment
                          .financial
                          .outstandingAmount !==
                        "0.00"
                          ? `${formatPaymentMoney(
                              installment
                                .financial
                                .outstandingAmount,
                              currency,
                            )} outstanding`
                          : "Settled"
                      }
                    </span>
                  </div>

                  <dl
                    className={
                      styles.meta
                    }
                  >
                    <div>
                      <dt>
                        Due
                      </dt>

                      <dd>
                        {formatPaymentDate(
                          installment
                            .dueDate ??
                            installment
                              .expectedDueDate,
                        )}
                      </dd>
                    </div>

                    <div>
                      <dt>
                        Timing
                      </dt>

                      <dd>
                        {
                          installment
                            .financial
                            .timingState
                        }
                      </dd>
                    </div>

                    {installment
                      .milestone && (
                      <div>
                        <dt>
                          Milestone
                        </dt>

                        <dd>
                          {
                            installment
                              .milestone
                          }
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </li>
            ),
          )}
        </ol>
      )}
    </section>
  );
}

function paymentVariant(
  state:
    PaymentInstallment[
      "financial"
    ]["paymentState"],
) {
  if (
    state === "paid" ||
    state === "waived"
  ) {
    return "success" as const;
  }

  if (state === "partial") {
    return "warning" as const;
  }

  return "neutral" as const;
}