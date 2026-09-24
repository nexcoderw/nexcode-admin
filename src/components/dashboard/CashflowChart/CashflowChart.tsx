"use client";

import { useState } from "react";

import type { CashflowMonth } from "@/types/dashboard/dashboard";
import {
  formatCompact,
  monthLabel,
  monthLongLabel,
  niceMax,
  toNumber,
} from "@/utils/dashboard/dashboard-format";
import { formatPaymentMoney } from "@/utils/payment/payment-format";

import styles from "./CashflowChart.module.css";

interface CashflowChartProps {
  months: CashflowMonth[];
  currency: string;
  /** YYYY-MM of the current month, which is emphasised. */
  currentMonth: string;
}

/**
 * Expected (a wide, receding column) against collected (a narrow accent
 * column in front of it): a shortfall shows as the grey left uncovered.
 */
export function CashflowChart({ months, currency, currentMonth }: CashflowChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const top = niceMax(
    Math.max(
      ...months.map((month) =>
        Math.max(toNumber(month.expected), toNumber(month.collected)),
      ),
    ),
  );
  const ticks = [top, top / 2, 0];
  const height = (amount: string | null) => `${(toNumber(amount) / top) * 100}%`;

  const hovered = active === null ? null : months[active];

  return (
    <div className={styles.chart} onPointerLeave={() => setActive(null)}>
      <div className={styles.grid} aria-hidden="true">
        {ticks.map((tick) => (
          <div key={tick} className={styles.gridLine}>
            <span>{formatCompact(tick)}</span>
          </div>
        ))}
      </div>

      <ol className={styles.columns}>
        {months.map((month, index) => {
          const upcoming = month.collected === null;
          const current = month.month === currentMonth;

          return (
            <li
              key={month.month}
              className={styles.column}
              data-active={active === index || undefined}
              data-current={current || undefined}
            >
              <button
                type="button"
                className={styles.hit}
                aria-label={`${monthLongLabel(month.month)}: collected ${formatPaymentMoney(month.collected ?? "0.00", currency)} of ${formatPaymentMoney(month.expected, currency)} expected`}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
              >
                <span className={styles.bars} aria-hidden="true">
                  <span
                    className={styles.expected}
                    style={{ height: height(month.expected) }}
                  />
                  {!upcoming && (
                    <span
                      className={styles.collected}
                      style={{ height: height(month.collected) }}
                    />
                  )}
                </span>
              </button>

              <span className={styles.label} aria-hidden="true">
                {monthLabel(month.month)}
              </span>
            </li>
          );
        })}
      </ol>

      {hovered && active !== null && (
        <div
          className={styles.tooltip}
          style={tooltipPosition((active + 0.5) / months.length)}
          role="presentation"
        >
          <strong>{monthLongLabel(hovered.month)}</strong>
          <span>
            <i className={styles.keyCollected} />
            {hovered.collected === null
              ? "Not yet due"
              : formatPaymentMoney(hovered.collected, currency)}
            <small>collected</small>
          </span>
          <span>
            <i className={styles.keyExpected} />
            {formatPaymentMoney(hovered.expected, currency)}
            <small>expected</small>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Centre the tooltip over the column, measured past the axis labels, and
 * keep it inside the chart at either end.
 */
function tooltipPosition(fraction: number) {
  const shift = fraction < 0.2 ? "-15%" : fraction > 0.8 ? "-85%" : "-50%";

  return {
    left: `calc(var(--axis-width) + (100% - var(--axis-width)) * ${fraction})`,
    transform: `translateX(${shift})`,
  };
}
