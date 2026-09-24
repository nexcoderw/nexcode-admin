import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Edit02Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import type {
  PaymentAgreement,
  PaymentAgreementListData,
} from "@/types/payment/agreement";
import {
  agreementStatusLabel,
  agreementStatusVariant,
  agreementTypeLabel,
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";
import {
  buildPaymentListHref,
  type ResolvedPaymentAgreementQuery,
} from "@/utils/payment/payment-page-query";

import styles from "./PaymentAgreementList.module.css";

interface PaymentAgreementListProps {
  data: PaymentAgreementListData;
  query: ResolvedPaymentAgreementQuery;
  filtered: boolean;
}

export function PaymentAgreementList({
  data,
  query,
  filtered,
}: PaymentAgreementListProps) {
  if (data.items.length === 0) {
    return <EmptyState filtered={filtered} />;
  }

  const { pagination } = data;

  return (
    <>
      {/* Scrolls sideways on narrow screens rather than hiding columns. */}
      <div className={styles.scroller}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>Payment agreements</caption>

          <thead>
            <tr>
              <th scope="col">Agreement</th>
              <th scope="col">Portfolio</th>
              <th scope="col">Type</th>
              <th scope="col" className={styles.numeric}>
                Value
              </th>
              <th scope="col">Period</th>
              <th scope="col">Status</th>
              <th scope="col" className={styles.action}>
                <span className={styles.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.items.map((agreement) => (
              <AgreementRow key={agreement.id} agreement={agreement} />
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Payment agreement pages">
          <span>
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.totalItems} agreements
          </span>

          <div className={styles.pages}>
            <PageLink
              href={buildPaymentListHref(query, pagination.page - 1)}
              enabled={pagination.hasPrevious}
            >
              <Icon icon={ArrowLeft01Icon} size={16} />
              Previous
            </PageLink>

            <PageLink
              href={buildPaymentListHref(query, pagination.page + 1)}
              enabled={pagination.hasNext}
            >
              Next
              <Icon icon={ArrowRight01Icon} size={16} />
            </PageLink>
          </div>
        </nav>
      )}
    </>
  );
}

function AgreementRow({ agreement }: { agreement: PaymentAgreement }) {
  const detailHref = PAYMENT_ROUTES.detail(agreement.id);

  return (
    <tr>
      <td>
        <div className={styles.stack}>
          <Link href={detailHref} className={styles.title}>
            {agreement.title}
          </Link>
          <small>{agreement.reference || "No reference"}</small>
        </div>
      </td>

      <td>{agreement.portfolio.name}</td>
      <td>{agreementTypeLabel(agreement.agreementType)}</td>

      <td className={styles.numeric}>
        <strong>
          {formatPaymentMoney(agreement.totalAmount, agreement.currency)}
        </strong>
      </td>

      <td className={styles.period}>
        {formatPaymentDate(agreement.startDate)}
        <span aria-hidden="true"> → </span>
        <span className={styles.srOnly}> to </span>
        {agreement.endDate ? formatPaymentDate(agreement.endDate) : "Open"}
      </td>

      <td>
        <Badge size="sm" variant={agreementStatusVariant(agreement.status)}>
          {agreementStatusLabel(agreement.status)}
        </Badge>
      </td>

      <td className={styles.action}>
        <Button
          href={PAYMENT_ROUTES.edit(agreement.id)}
          size="sm"
          variant="ghost"
          iconOnly
          leftIcon={<Icon icon={Edit02Icon} size={16} />}
          aria-label={`Edit ${agreement.title}`}
          title="Edit"
        >
          Edit
        </Button>
      </td>
    </tr>
  );
}

function PageLink({
  href,
  enabled,
  children,
}: {
  href: string;
  enabled: boolean;
  children: ReactNode;
}) {
  return enabled ? (
    <Link href={href} className={styles.pageLink}>
      {children}
    </Link>
  ) : (
    <span className={styles.pageLink} aria-disabled="true">
      {children}
    </span>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <section className={styles.empty}>
      <Icon icon={File01Icon} size={26} />

      <h2>{filtered ? "No matching agreements" : "No payment agreements yet"}</h2>

      <p>
        {filtered
          ? "No agreement matches these filters. Change or reset them."
          : "Create the first payment agreement for a portfolio."}
      </p>

      <Button
        href={filtered ? PAYMENT_ROUTES.list : PAYMENT_ROUTES.add}
        variant={filtered ? "secondary" : "primary"}
      >
        {filtered ? "Reset filters" : "Add agreement"}
      </Button>
    </section>
  );
}
