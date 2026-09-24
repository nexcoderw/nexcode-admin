import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

import { Meter, Sparkline, StatTile } from "@/components/dashboard/StatTile/StatTile";
import { Icon } from "@/components/ui/Icon/Icon";
import type { DashboardOverview } from "@/types/dashboard/dashboard";
import {
  formatCompactMoney,
  percentChange,
  toNumber,
} from "@/utils/dashboard/dashboard-format";
import { formatPaymentMoney } from "@/utils/payment/payment-format";

import styles from "./DashboardFigures.module.css";

interface DashboardFiguresProps {
  data: DashboardOverview;
  currentMonth: string;
}

/**
 * The headline row: one hero figure, then the numbers that decide
 * what to do next.
 */
export function DashboardFigures({ data, currentMonth }: DashboardFiguresProps) {
  const { money, counts, currency } = data;

  const collected = toNumber(money.collectedThisMonth);
  const change = percentChange(collected, toNumber(money.collectedLastMonth));

  const thisMonth = data.cashflow.find((month) => month.month === currentMonth);
  const expected = toNumber(thisMonth?.expected ?? "0.00");
  const progress = expected > 0 ? Math.round((collected / expected) * 100) : null;

  // The trend up to this month; future months have nothing collected.
  const trend = data.cashflow
    .filter((month) => month.collected !== null)
    .map((month) => toNumber(month.collected));

  return (
    <section className={styles.figures} aria-label="Key figures">
      <StatTile
        hero
        label="Collected this month"
        value={formatCompactMoney(money.collectedThisMonth, currency)}
        detail={<Change percent={change} />}
      >
        <Sparkline values={trend} label={`Collected per month, last ${trend.length} months`} />
      </StatTile>

      <StatTile
        label="This month's target"
        value={progress === null ? "—" : `${progress}%`}
        detail={
          expected > 0
            ? `of ${formatPaymentMoney(thisMonth!.expected, currency)} expected`
            : "Nothing falls due this month"
        }
      >
        <Meter value={collected} max={expected} label="Share of this month's expected money collected" />
      </StatTile>

      <StatTile
        label="Outstanding"
        value={formatCompactMoney(money.outstanding, currency)}
        detail={
          money.overdueCount > 0 ? (
            <span className={styles.critical}>
              <Icon icon={AlertCircleIcon} size={14} />
              {formatPaymentMoney(money.overdue, currency)} overdue
            </span>
          ) : (
            <span className={styles.good}>
              <Icon icon={CheckmarkCircle02Icon} size={14} />
              Nothing overdue
            </span>
          )
        }
      />

      <StatTile
        label="Due in the next 30 days"
        value={formatCompactMoney(money.expectedNext30Days, currency)}
        detail={`${counts.activeAgreements} active agreements`}
      />

      <StatTile
        label="Unanswered messages"
        value={String(counts.unansweredMessages)}
        detail={`${counts.messagesThisMonth} received this month`}
      />
    </section>
  );
}

/**
 * The change against last month, in words and with an arrow, so the
 * direction never rests on colour.
 */
function Change({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <span>No payments last month to compare</span>;
  }

  if (percent === 0) {
    return <span>Same as last month</span>;
  }

  const up = percent > 0;

  return (
    <span className={up ? styles.good : styles.critical}>
      <Icon icon={up ? ArrowUp01Icon : ArrowDown01Icon} size={14} />
      {up ? "Up" : "Down"} {Math.abs(percent)}% on last month
    </span>
  );
}
