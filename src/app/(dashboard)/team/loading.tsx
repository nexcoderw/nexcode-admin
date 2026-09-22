import styles from "./loading.module.css";

export default function TeamLoading() {
  return (
    <div className={styles.page} aria-busy="true" aria-label={"Loading team"}>
      <div className={styles.header}>
        <span className={styles.heading} />

        <span className={styles.action} />
      </div>

      <div className={styles.filters} />

      <div className={styles.table}>
        {Array.from(
          {
            length: 6,
          },
          (_, index) => (
            <span key={index} className={styles.row} />
          ),
        )}
      </div>
    </div>
  );
}
