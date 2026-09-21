import type { HTMLAttributes, ReactNode } from "react";

import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /**

* Semantic meaning and visual treatment.
*
* @default "info"
  */
  variant?: AlertVariant;

  /**

* Optional alert heading.
  */
  title?: ReactNode;

  /**

* Main alert content.
  */
  children: ReactNode;

  /**

* Optional Hugeicons icon displayed before the content.
*
* The icon is decorative because the alert's text communicates
* its meaning to assistive technologies.
  */
  icon?: ReactNode;

  /**

* Optional action displayed beside the alert content.
*
* Prefer Button or another accessible interactive component.
  */
  action?: ReactNode;
}

export function Alert({
  variant = "info",
  title,
  children,
  icon,
  action,
  className,
  role,
  ...props
}: AlertProps) {
  const classes = [styles.alert, styles[variant], className ?? ""]
    .filter(Boolean)
    .join(" ");

  const resolvedRole = role ?? (variant === "error" ? "alert" : "status");

  return (
    <div {...props} className={classes} role={resolvedRole}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}{" "}
        </span>
      )}

      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}

        <div className={styles.message}>{children}</div>
      </div>

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
