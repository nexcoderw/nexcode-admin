import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";

import {
  Badge,
  type BadgeVariant,
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
  PaymentAgreement,
} from "@/types/payment/agreement";
import {
  agreementStatusLabel,
  agreementTypeLabel,
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./PaymentAgreementCard.module.css";

interface PaymentAgreementCardProps {
  agreement:
    PaymentAgreement;
}

export function PaymentAgreementCard({
  agreement,
}: PaymentAgreementCardProps) {
  return (
    <article
      className={
        styles.card
      }
    >
      <header
        className={
          styles.header
        }
      >
        <span
          className={
            styles.icon
          }
        >
          <Icon
            icon={
              Briefcase01Icon
            }
            size={20}
          />
        </span>

        <div
          className={
            styles.identity
          }
        >
          <h2>
            {agreement.title}
          </h2>

          <span>
            {agreement
              .portfolio
              .name}
          </span>
        </div>

        <Badge
          size="sm"
          variant={
            statusVariant(
              agreement.status,
            )
          }
        >
          {agreementStatusLabel(
            agreement.status,
          )}
        </Badge>
      </header>

      <div
        className={
          styles.amount
        }
      >
        <span>
          Contract value
        </span>

        <strong>
          {formatPaymentMoney(
            agreement.totalAmount,
            agreement.currency,
          )}
        </strong>
      </div>

      <dl
        className={
          styles.details
        }
      >
        <div>
          <dt>
            Type
          </dt>

          <dd>
            {agreementTypeLabel(
              agreement
                .agreementType,
            )}
          </dd>
        </div>

        <div>
          <dt>
            Starts
          </dt>

          <dd>
            {formatPaymentDate(
              agreement.startDate,
            )}
          </dd>
        </div>

        <div>
          <dt>
            Ends
          </dt>

          <dd>
            {formatPaymentDate(
              agreement.endDate,
            )}
          </dd>
        </div>
      </dl>

      <footer
        className={
          styles.actions
        }
      >
        <Button
          href={
            PAYMENT_ROUTES.detail(
              agreement.id,
            )
          }
          size="sm"
          variant="secondary"
          rightIcon={
            <Icon
              icon={
                ArrowRight01Icon
              }
              size={16}
            />
          }
        >
          Details
        </Button>

        <Button
          href={
            PAYMENT_ROUTES.edit(
              agreement.id,
            )
          }
          size="sm"
          variant="ghost"
          leftIcon={
            <Icon
              icon={
                Edit02Icon
              }
              size={16}
            />
          }
        >
          Edit
        </Button>
      </footer>
    </article>
  );
}

function statusVariant(
  status:
    PaymentAgreement["status"],
): BadgeVariant {
  if (status === "active") {
    return "success";
  }

  if (
    status ===
    "cancelled"
  ) {
    return "error";
  }

  if (
    status ===
    "completed"
  ) {
    return "primary";
  }

  return "neutral";
}