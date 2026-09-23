import styles from "./ErrorArt.module.css";

/**
 * 500 — a panel with a break in it, and a spark that keeps trying to
 * cross. Its own shape, so it is never mistaken for the 503 screen.
 */
export function ApplicationErrorArt() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="presentation"
      focusable="false"
      className={styles.art}
    >
      <ellipse className={styles.ground} cx="160" cy="206" rx="104" ry="14" />

      <rect
        className={styles.body}
        x="56"
        y="54"
        width="208"
        height="136"
        rx="16"
      />

      <rect className={styles.slot} x="78" y="76" width="66" height="14" rx="7" />
      <rect className={styles.slot} x="78" y="154" width="42" height="14" rx="7" />

      <circle className={styles.lamp} cx="238" cy="83" r="6" />

      {/* The break, drawn straight down the panel. */}
      <path className={styles.break} d="M160 54L146 104L174 128L154 190" />

      {/* A spark arcing across the gap, never quite bridging it. */}
      <path className={styles.spark} d="M188 96L166 124L186 130L164 158" />
    </svg>
  );
}
