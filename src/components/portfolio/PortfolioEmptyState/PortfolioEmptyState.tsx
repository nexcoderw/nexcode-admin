import { Briefcase01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";

import styles from "./PortfolioEmptyState.module.css";

interface PortfolioEmptyStateProps {
  filtered: boolean;
}

export function PortfolioEmptyState({ filtered }: PortfolioEmptyStateProps) {
  return (
    <section className={styles.empty}>
      <span className={styles.icon}>
        <Icon icon={Briefcase01Icon} size={26} />
      </span>

      <div className={styles.content}>
        <h2>{filtered ? "No matching portfolios" : "No portfolios yet"}</h2>

        <p>
          {filtered
            ? "Change or reset the active filters."
            : "Create the first NEXCODE portfolio project."}
        </p>
      </div>

      <Button
        href={filtered ? ROUTES.admin.portfolios : ROUTES.admin.portfolioAdd}
        variant={filtered ? "secondary" : "primary"}
        leftIcon={<Icon icon={Briefcase01Icon} size={17} />}
      >
        {filtered ? "Reset filters" : "Add portfolio"}
      </Button>
    </section>
  );
}
