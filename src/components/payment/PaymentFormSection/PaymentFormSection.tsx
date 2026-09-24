import type { ReactNode } from "react";

import styles from "./PaymentFormSection.module.css";

interface PaymentFormSectionProps {
  title: string;
  description: string;

  /**
   * One field across the whole row, such as a notes box.
   */
  wide?: boolean;

  children: ReactNode;
}

/**
 * One flat row: the section's name and purpose on the left, its fields
 * side by side on the right.
 */
export function PaymentFormSection({
  title,
  description,
  wide,
  children,
}: PaymentFormSectionProps) {
  const headingId = `agreement-${title.toLowerCase()}`;

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.sectionText}>
        <h2 id={headingId}>{title}</h2>
        <p>{description}</p>
      </div>

      <div className={wide ? styles.wideFields : styles.fields}>{children}</div>
    </section>
  );
}
