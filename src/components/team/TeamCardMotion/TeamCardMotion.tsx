import styles from "./TeamCardMotion.module.css";

export function TeamCardMotion() {
  return (
    <div className={styles.motion} aria-hidden="true">
      <span className={styles.orbitLarge} />
      <span className={styles.orbitSmall} />
      <span className={styles.axis} />
      <span className={styles.node} />
    </div>
  );
}
