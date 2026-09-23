import styles from "./ErrorArt.module.css";

/**
 * 503 — a server sending waves out with nothing coming back.
 *
 * Flat brand colour on design tokens, no gradients. The pulse is
 * decoration: the screen states the problem in words beside it, so
 * reduced motion simply holds the waves still.
 */
export function ServiceUnavailableArt() {
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
        x="92"
        y="62"
        width="136"
        height="128"
        rx="14"
      />

      <rect className={styles.slot} x="110" y="84" width="100" height="26" rx="8" />
      <rect className={styles.slot} x="110" y="122" width="100" height="26" rx="8" />

      <circle className={styles.lamp} cx="196" cy="97" r="6" />
      <circle className={styles.lampOff} cx="196" cy="135" r="6" />

      <rect className={styles.foot} x="112" y="190" width="18" height="12" rx="4" />
      <rect className={styles.foot} x="190" y="190" width="18" height="12" rx="4" />

      {/* Waves leaving the server on both sides, answered by nothing. */}
      <g className={styles.waves}>
        <path className={styles.wave} d="M70 96C52 114 52 138 70 156" />
        <path className={styles.waveMid} d="M48 80C22 110 22 142 48 172" />
        <path className={styles.waveFar} d="M26 64C-8 106 -8 146 26 188" />

        <path className={styles.wave} d="M250 96C268 114 268 138 250 156" />
        <path className={styles.waveMid} d="M272 80C298 110 298 142 272 172" />
        <path className={styles.waveFar} d="M294 64C328 106 328 146 294 188" />
      </g>
    </svg>
  );
}
