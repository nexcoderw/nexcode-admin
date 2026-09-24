import type { ReactNode } from "react";

import styles from "./ChartFrame.module.css";

export interface LegendItem {
  label: string;
  /** A CSS colour, normally a --chart-* token. */
  color: string;
  /** Mirrors the mark: a block for bars, a stroke for lines. */
  kind: "bar" | "line";
}

interface ChartFrameProps {
  title: string;
  description?: string;

  /**
   * Shown for two or more series. A single series is named by the title,
   * so it needs none.
   */
  legend?: LegendItem[];

  /** A summary figure beside the title, such as a total. */
  aside?: ReactNode;

  /** The same data as a table, for reading without hovering. */
  table: ReactNode;

  children: ReactNode;
}

export function ChartFrame({
  title,
  description,
  legend,
  aside,
  table,
  children,
}: ChartFrameProps) {
  return (
    <section className={styles.frame} aria-label={title}>
      <header className={styles.header}>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        {aside && <div className={styles.aside}>{aside}</div>}
      </header>

      {legend && legend.length > 1 && (
        <ul className={styles.legend}>
          {legend.map((item) => (
            <li key={item.label}>
              <span
                className={item.kind === "line" ? styles.keyLine : styles.keyBar}
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.plot}>{children}</div>

      <details className={styles.table}>
        <summary>View as table</summary>
        {table}
      </details>
    </section>
  );
}
