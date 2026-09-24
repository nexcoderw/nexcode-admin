import {
  AlertCircleIcon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import type {
  DashboardOverview,
  InstallmentAlert,
} from "@/types/dashboard/dashboard";
import { dayLabel, relativeDays } from "@/utils/dashboard/dashboard-format";
import { formatPaymentMoney } from "@/utils/payment/payment-format";

import styles from "./AttentionPanel.module.css";

type Alerts = DashboardOverview["alerts"];

/**
 * What needs acting on: overdue money, money due within a week, and
 * contracts about to end. Each row carries an icon and a word for its
 * state, so colour is never the only signal.
 */
export function AttentionPanel({ alerts }: { alerts: Alerts }) {
  const total = alerts.overdue.length + alerts.dueSoon.length + alerts.endingSoon.length;

  if (total === 0) {
    return (
      <section className={styles.clear} aria-label="Needs attention">
        <Icon icon={CheckmarkCircle02Icon} size={18} />
        Nothing needs attention: no payments are overdue or due this week.
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="attention-title">
      <h2 id="attention-title" className={styles.title}>
        Needs attention <span>{total}</span>
      </h2>

      <ul className={styles.list}>
        {alerts.overdue.map((alert) => (
          <InstallmentRow key={`o${alert.installmentId}`} alert={alert} overdue />
        ))}

        {alerts.dueSoon.map((alert) => (
          <InstallmentRow key={`d${alert.installmentId}`} alert={alert} />
        ))}

        {alerts.endingSoon.map((alert) => (
          <li key={`e${alert.agreementId}`} className={styles.row} data-tone="info">
            <span className={styles.icon} aria-hidden="true">
              <Icon icon={Calendar03Icon} size={17} />
            </span>

            <span className={styles.state}>Ending</span>

            <Link href={PAYMENT_ROUTES.detail(alert.agreementId)} className={styles.what}>
              <strong>{alert.agreementTitle}</strong>
              <small>{alert.portfolioName}</small>
            </Link>

            <span className={styles.amount} />

            <span className={styles.when}>
              {dayLabel(alert.endDate)} · {relativeDays(alert.days)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InstallmentRow({
  alert,
  overdue = false,
}: {
  alert: InstallmentAlert;
  overdue?: boolean;
}) {
  const tone = overdue && !alert.inGrace ? "critical" : "warning";
  const state = overdue ? (alert.inGrace ? "In grace" : "Overdue") : "Due soon";

  return (
    <li className={styles.row} data-tone={tone}>
      <span className={styles.icon} aria-hidden="true">
        <Icon icon={overdue ? AlertCircleIcon : Clock01Icon} size={17} />
      </span>

      <span className={styles.state}>{state}</span>

      <Link href={PAYMENT_ROUTES.detail(alert.agreementId)} className={styles.what}>
        <strong>{alert.title}</strong>
        <small>
          {alert.agreementTitle} · {alert.portfolioName}
        </small>
      </Link>

      <span className={styles.amount}>
        {formatPaymentMoney(alert.outstanding, alert.currency)}
      </span>

      <span className={styles.when}>
        {dayLabel(alert.dueDate)} · {relativeDays(alert.days, overdue)}
      </span>
    </li>
  );
}
