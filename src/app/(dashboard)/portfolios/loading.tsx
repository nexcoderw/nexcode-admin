import { LoadingIndicator } from "@/components/ui/LoadingIndicator/LoadingIndicator";

import styles from "./loading.module.css";

export default function PortfolioLoading() {
  return (
    <div className={styles.loading}>
      <LoadingIndicator
        label="Loading portfolios"
        size="lg"
        variant="section"
        showLabel
      />
    </div>
  );
}
