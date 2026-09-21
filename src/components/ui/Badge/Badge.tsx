import type { HTMLAttributes, ReactNode } from "react";

import styles from "./Badge.module.css";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**

* Content displayed inside the badge.
  */
  children: ReactNode;

  /**

* Semantic visual treatment.
*
* @default "neutral"
  */
  variant?: BadgeVariant;

  /**

* Controls badge dimensions and typography.
*
* @default "md"
  */
  size?: BadgeSize;

  /**

* Optional decorative Hugeicons icon.
  */
  icon?: ReactNode;

  /**

* Displays a small status indicator before the label.
  */
  showDot?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon,
  showDot = false,
  className,
  ...props
}: BadgeProps) {
  const classes = [styles.badge, styles[variant], styles[size], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...props} className={classes}>
      {showDot && <span className={styles.dot} aria-hidden="true" />}

      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}

      <span className={styles.label}>{children}</span>
    </span>
  );
}
