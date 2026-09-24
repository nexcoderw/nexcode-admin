import styles from "./ErrorArt.module.css";

/**
 * 404 — a map pin hovering over a search ring that keeps sweeping.
 *
 * Flat brand colour on design tokens, no gradients. The sweep and the
 * hover are decoration and stop under reduced motion.
 */
export function NotFoundArt() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="presentation"
      focusable="false"
      className={styles.art}
    >
      <ellipse className={styles.ground} cx="160" cy="206" rx="104" ry="14" />

      {/* The search area: an outer ring, an inner ring, and the sweep. */}
      <circle className={styles.ring} cx="160" cy="150" r="72" />
      <circle className={styles.ringInner} cx="160" cy="150" r="40" />
      <path className={styles.sweep} d="M160 78A72 72 0 0 1 232 150" />

      {/* Where the pin would land, if there were anything to find. */}
      <ellipse className={styles.pinShadow} cx="160" cy="152" rx="16" ry="5" />

      <g className={styles.pin}>
        <path
          className={styles.pinBody}
          d="M160 146C160 146 132 116 132 98A28 28 0 1 1 188 98C188 116 160 146 160 146Z"
        />
        <circle className={styles.pinHole} cx="160" cy="98" r="10" />
      </g>
    </svg>
  );
}
