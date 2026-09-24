import styles from "./ErrorArt.module.css";

/**
 * 401 — a key that approaches a lock and is turned away.
 *
 * The key reaches the keyhole, the lock shakes it off, and the key
 * backs away. Both halves share one timing so they stay in step.
 */
export function UnauthorizedArt() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="presentation"
      focusable="false"
      className={styles.art}
    >
      <ellipse className={styles.ground} cx="160" cy="206" rx="104" ry="14" />

      <g className={styles.lock}>
        <path
          className={styles.lockShackle}
          d="M196 112V88A26 26 0 0 1 248 88V112"
        />
        <rect
          className={styles.body}
          x="180"
          y="108"
          width="84"
          height="78"
          rx="14"
        />
        <circle className={styles.keyhole} cx="222" cy="140" r="8" />
        <rect
          className={styles.keyhole}
          x="218"
          y="142"
          width="8"
          height="20"
          rx="3"
        />
      </g>

      <g className={styles.key}>
        <circle className={styles.keyBow} cx="72" cy="148" r="18" />
        <circle className={styles.keyBowHole} cx="72" cy="148" r="7" />
        <rect className={styles.keyShaft} x="88" y="144" width="74" height="8" rx="4" />
        <rect className={styles.keyShaft} x="138" y="152" width="8" height="12" rx="2" />
        <rect className={styles.keyShaft} x="152" y="152" width="8" height="8" rx="2" />
      </g>
    </svg>
  );
}
