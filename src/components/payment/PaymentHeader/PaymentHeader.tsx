import {
  File01Icon,
} from "@hugeicons/core-free-icons";

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
  PortfolioSummary,
} from "@/types/portfolio/portfolio";
import type {
  ResolvedPaymentAgreementQuery,
} from "@/utils/payment/payment-page-query";

import {
  PaymentFilter,
} from "../PaymentFilter/PaymentFilter";

import styles from "./PaymentHeader.module.css";

interface PaymentHeaderProps {
  query:
    ResolvedPaymentAgreementQuery;

  portfolios:
    PortfolioSummary[];
}

export function PaymentHeader({
  query,
  portfolios,
}: PaymentHeaderProps) {
  return (
    <header
      className={
        styles.header
      }
    >
      <div>
        <span
          className={
            styles.eyebrow
          }
        >
          Financial management
        </span>

        <h1>
          Payments
        </h1>

        <p>
          Track agreements, expected installments,
          received transactions, balances and payment reminders.
        </p>
      </div>

      <div
        className={
          styles.actions
        }
      >
        <PaymentFilter
          query={query}
          portfolios={
            portfolios
          }
        />

        <Button
          href={
            PAYMENT_ROUTES.add
          }
          leftIcon={
            <Icon
              icon={
                File01Icon
              }
              size={17}
            />
          }
        >
          Add agreement
        </Button>
      </div>
    </header>
  );
}