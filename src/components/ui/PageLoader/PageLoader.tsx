import Image from "next/image";

import styles from "./PageLoader.module.css";

interface PageLoaderProps {
  /**
   * What is being prepared, shown under the mark and announced to
   * assistive technology.
   *
   * @default "Preparing your workspace"
   */
  label?: string;
}

/*
 * Orbit geometry: a 44-unit radius in a 96-unit box leaves room for the
 * stroke. The arc covers a quarter of the circumference.
 */
const ORBIT_RADIUS = 44;
const ORBIT_CIRCUMFERENCE = 2 * Math.PI * ORBIT_RADIUS;
const ORBIT_ARC = ORBIT_CIRCUMFERENCE / 4;

/**
 * The admin's single page-level loading state.
 *
 * Rendered by the dashboard route's `loading.tsx`, so every page shows
 * the same loader while its data resolves. Animation is CSS-only and
 * limited to transform and opacity, and the loader stays hidden for the
 * first moment so quick navigations never flash it.
 */
export function PageLoader({
  label = "Preparing your workspace",
}: PageLoaderProps) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.emblem} aria-hidden="true">
        <span className={styles.halo} />

        <svg className={styles.orbit} viewBox="0 0 96 96">
          <circle
            className={styles.track}
            cx="48"
            cy="48"
            r={ORBIT_RADIUS}
          />

          <circle
            className={styles.arc}
            cx="48"
            cy="48"
            r={ORBIT_RADIUS}
            strokeDasharray={`${ORBIT_ARC} ${ORBIT_CIRCUMFERENCE}`}
          />
        </svg>

        <Image
          className={styles.mark}
          src="/svg/nexcode-icon-white.svg"
          alt=""
          width={30}
          height={30}
          priority
        />
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span className={styles.bar} />
      </div>

      <p className={styles.label}>{label}</p>
    </div>
  );
}
