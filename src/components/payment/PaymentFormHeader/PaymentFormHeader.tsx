import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "@/components/ui/Icon/Icon";

import styles from "./PaymentFormHeader.module.css";

interface PaymentFormHeaderProps {
  backHref: string;
  backLabel: string;
  title: string;
  description: string;

  /**
   * Secondary actions beside the title, such as a delete button.
   */
  actions?: ReactNode;
}

/**
 * The flat header of the agreement add and edit pages.
 */
export function PaymentFormHeader({
  backHref,
  backLabel,
  title,
  description,
  actions,
}: PaymentFormHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href={backHref} className={styles.back}>
        <Icon icon={ArrowLeft01Icon} size={16} />
        {backLabel}
      </Link>

      <div className={styles.row}>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}
