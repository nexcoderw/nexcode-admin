import styles from "./page.module.css";

export default function PaymentReportsLoading() {
  return (
    <div
      className={
        styles.loading
      }
      aria-label="Loading payment reports"
      aria-busy="true"
    >
      <span />
      <span />
      <span />
    </div>
  );
}