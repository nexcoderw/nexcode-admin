import styles from "./ErrorArt.module.css";

/**
 * 403 — a shield with a bar drawn across it as the screen appears.
 *
 * The bar is part of the drawing, not decoration: with reduced motion it
 * is held at its finished position rather than removed.
 */
export function ForbiddenArt() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="presentation"
      focusable="false"
      className={styles.art}
    >
      <ellipse className={styles.ground} cx="160" cy="206" rx="104" ry="14" />

      <path
        className={styles.body}
        d="M160 40L220 64V118C220 156 194 182 160 198C126 182 100 156 100 118V64Z"
      />
      <path
        className={styles.shieldInner}
        d="M160 62L202 79V118C202 145 184 164 160 176C136 164 118 145 118 118V79Z"
      />

      {/* A horizontal bar, tilted into place, drawn from its left end. */}
      <g transform="rotate(-32 160 120)">
        <line className={styles.bar} x1="86" y1="120" x2="234" y2="120" />
      </g>
    </svg>
  );
}
