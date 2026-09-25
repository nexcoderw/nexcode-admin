import { Add01Icon, File01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import type { PortfolioSummary } from "@/types/portfolio/portfolio";
import type { ResolvedPaymentAgreementQuery } from "@/utils/payment/payment-page-query";

import { PaymentFilter } from "../PaymentFilter/PaymentFilter";

import styles from "./PaymentHeader.module.css";

interface PaymentHeaderProps {
  query: ResolvedPaymentAgreementQuery;
  portfolios: PortfolioSummary[];

  /**
   * Agreements matching the current filters; omitted when the list
   * could not be loaded.
   */
  total?: number;
}

export function PaymentHeader({
  query,
  portfolios,
  total,
}: PaymentHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <span className={styles.eyebrow}>Financial management</span>

        <h1>
          Payments
          {total !== undefined && <span className={styles.total}>{total}</span>}
        </h1>

        <p>Agreements, their schedules, received payments and reminders.</p>
      </div>

      <div className={styles.actions}>
        <Button
          href={PAYMENT_ROUTES.reports}
          variant="secondary"
          leftIcon={<Icon icon={File01Icon} size={17} />}
        >
          Reports
        </Button>

        <PaymentFilter query={query} portfolios={portfolios} />

        <Button
          href={PAYMENT_ROUTES.add}
          leftIcon={<Icon icon={Add01Icon} size={17} />}
        >
          Add agreement
        </Button>
      </div>
    </header>
  );
}
