"use client";

import { useState } from "react";

import type { MessageWeek } from "@/types/dashboard/dashboard";
import { dayLabel, niceMax } from "@/utils/dashboard/dashboard-format";

import styles from "./MessagesTrend.module.css";

interface MessagesTrendProps {
  weeks: MessageWeek[];
}

/**
 * Website messages per week: one accent line over a light wash, with a
 * crosshair that snaps to the nearest week.
 */
export function MessagesTrend({ weeks }: MessagesTrendProps) {
  const [active, setActive] = useState<number | null>(null);

  const top = niceMax(Math.max(...weeks.map((week) => week.count), 1));
  const last = weeks.length - 1;

  // A 100 × 100 plane, stretched to fit; the stroke keeps its 2px.
  const x = (index: number) => (last === 0 ? 50 : (index / last) * 100);
  const y = (count: number) => 100 - (count / top) * 100;

  const line = weeks
    .map((week, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(week.count)}`)
    .join(" ");
  const area = `${line} L100,100 L0,100 Z`;

  const focus = active ?? last;
  const point = weeks[focus];

  return (
    <div className={styles.chart} onPointerLeave={() => setActive(null)}>
      <div className={styles.plot}>
        <span className={styles.top} aria-hidden="true">
          {top}
        </span>

        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={area} className={styles.area} />
          <path d={line} className={styles.line} />
        </svg>

        {/* The crosshair and marker are HTML so they never stretch. */}
        {active !== null && (
          <span
            className={styles.crosshair}
            style={{ left: `${x(active)}%` }}
            aria-hidden="true"
          />
        )}
        <span
          className={styles.dot}
          style={{ left: `${x(focus)}%`, top: `${y(point.count)}%` }}
          aria-hidden="true"
        />

        {/* One target per week, centred on its point: the strip overhangs
            each end by half a cell. */}
        <ol
          className={styles.hits}
          style={{
            left: `${last === 0 ? 0 : -50 / last}%`,
            right: `${last === 0 ? 0 : -50 / last}%`,
          }}
        >
          {weeks.map((week, index) => (
            <li key={week.week}>
              <button
                type="button"
                aria-label={`Week of ${dayLabel(week.week)}: ${week.count} messages`}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.axis} aria-hidden="true">
        <span>{dayLabel(weeks[0].week)}</span>
        <span>This week</span>
      </div>

      <p className={styles.readout} aria-live="polite">
        <strong>{point.count}</strong>{" "}
        {point.count === 1 ? "message" : "messages"}
        <span>
          {focus === last ? "this week" : `week of ${dayLabel(point.week)}`}
        </span>
      </p>
    </div>
  );
}
