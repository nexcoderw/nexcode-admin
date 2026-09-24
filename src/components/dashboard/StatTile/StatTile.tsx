import type { ReactNode } from "react";

import styles from "./StatTile.module.css";

interface StatTileProps {
  label: string;
  value: string;
  /** A line under the value: a change, a count, a status. */
  detail?: ReactNode;
  /** The dashboard's one hero figure is set larger. */
  hero?: boolean;
  /** A small chart under the figure: sparkline or meter. */
  children?: ReactNode;
}

export function StatTile({ label, value, detail, hero, children }: StatTileProps) {
  return (
    <article className={styles.tile} data-hero={hero || undefined}>
      <h3 className={styles.label}>{label}</h3>
      <p className={styles.value}>{value}</p>
      {detail && <div className={styles.detail}>{detail}</div>}
      {children && <div className={styles.visual}>{children}</div>}
    </article>
  );
}

/**
 * A trend line with no axes: the past recedes, the latest point is lit.
 */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const top = Math.max(...values, 1);
  const last = values.length - 1;
  const x = (index: number) => (last === 0 ? 50 : (index / last) * 100);
  const y = (value: number) => 28 - (value / top) * 26;

  const path = values
    .map((value, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(value)}`)
    .join(" ");

  return (
    <div className={styles.sparkline}>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" role="img" aria-label={label}>
        <path d={path} className={styles.sparkPath} />
      </svg>
      <span
        className={styles.sparkDot}
        style={{ left: `${x(last)}%`, top: `${(y(values[last] ?? 0) / 30) * 100}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * A share of a whole: the fill on a track of the same colour family.
 */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const share = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <div
      className={styles.meter}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(share * 100)}
    >
      <span className={styles.meterFill} style={{ width: `${share * 100}%` }} />
    </div>
  );
}
