import type { CountSlice } from "@/types/dashboard/dashboard";

import styles from "./BreakdownCharts.module.css";

// Categorical slots, in fixed order: a slice keeps its colour whatever
// the counts, and a fifth slice would fold into "Other", never a new hue.
const SERIES = [
  "var(--chart-series-1)",
  "var(--chart-series-2)",
  "var(--chart-series-3)",
  "var(--chart-series-4)",
];

/**
 * Part-to-whole as one stacked bar. The legend carries every count, so
 * nothing depends on colour or hovering.
 */
export function StackedShare({ slices }: { slices: CountSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <div className={styles.stacked}>
      <div
        className={styles.stack}
        role="img"
        aria-label={slices.map((slice) => `${slice.label}: ${slice.count}`).join(", ")}
      >
        {total === 0 ? (
          <span className={styles.emptyStack} />
        ) : (
          slices.map((slice, index) =>
            slice.count > 0 ? (
              <span
                key={slice.key}
                className={styles.segment}
                style={{ flexGrow: slice.count, background: SERIES[index] }}
                title={`${slice.label}: ${slice.count}`}
              />
            ) : null,
          )
        )}
      </div>

      <ul className={styles.keys}>
        {slices.map((slice, index) => (
          <li key={slice.key}>
            <span
              className={styles.swatch}
              style={{ background: SERIES[index] }}
              aria-hidden="true"
            />
            <span className={styles.keyLabel}>{slice.label}</span>
            <strong>{slice.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Magnitude by category: one hue, longest bar first, value at the tip.
 */
export function RankedBars({ slices }: { slices: CountSlice[] }) {
  const ranked = [...slices].sort((a, b) => b.count - a.count);
  const top = Math.max(...ranked.map((slice) => slice.count), 1);

  return (
    <ul className={styles.bars}>
      {ranked.map((slice) => (
        <li key={slice.key}>
          <span className={styles.barLabel}>{slice.label}</span>

          <span className={styles.track}>
            <span
              className={styles.bar}
              // Leaves room at the end of the track for the value.
              style={{ width: `calc((100% - 2.5rem) * ${slice.count / top})` }}
            />
            <strong>{slice.count}</strong>
          </span>
        </li>
      ))}
    </ul>
  );
}
