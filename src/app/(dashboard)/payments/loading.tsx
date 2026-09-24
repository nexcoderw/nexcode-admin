import styles from "./page.module.css";

export default function PaymentLoading() {
  return (
    <div
      className={
        styles.loading
      }
      aria-label="Loading payments"
      aria-busy="true"
    >
      <span />
      <span />
      <span />
    </div>
  );
}