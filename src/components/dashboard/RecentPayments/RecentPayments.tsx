import Link from "next/link";

import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import type { RecentPayment } from "@/types/dashboard/dashboard";
import {
  formatPaymentDate,
  formatPaymentMoney,
} from "@/utils/payment/payment-format";

import styles from "./RecentPayments.module.css";

interface RecentPaymentsProps {
  payments: RecentPayment[];
  currency: string;
}

export function RecentPayments({ payments, currency }: RecentPaymentsProps) {
  if (payments.length === 0) {
    return <p className={styles.empty}>No {currency} payments recorded yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {payments.map((payment) => (
        <li key={payment.id}>
          <Link
            href={`${PAYMENT_ROUTES.detail(payment.agreementId)}?tab=payments`}
            className={styles.what}
          >
            <strong>{payment.agreementTitle}</strong>
            <small>
              {payment.portfolioName} · {payment.paymentMethod.replaceAll("_", " ")}
            </small>
          </Link>

          <span className={styles.figures}>
            <strong>{formatPaymentMoney(payment.amount, currency)}</strong>
            <small>{formatPaymentDate(payment.paidAt)}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
