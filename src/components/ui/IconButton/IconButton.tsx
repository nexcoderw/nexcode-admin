import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./IconButton.module.css";

export type IconButtonVariant = "default" | "ghost" | "primary" | "danger";

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> {
  /**

* Hugeicons icon rendered inside the button.
  */
  icon: ReactNode;

  /**

* Accessible name describing the action.
*
* Required because IconButton has no visible text label.
  */
  "aria-label": string;

  /**

* Visual treatment of the button.
*
* @default "default"
  */
  variant?: IconButtonVariant;

  /**

* Controls the dimensions and icon size.
*
* @default "md"
  */
  size?: IconButtonSize;

  /**

* Displays a loading state and prevents interaction.
  */
  isLoading?: boolean;
}

export function IconButton({
  icon,
  variant = "default",
  size = "md",
  isLoading = false,
  disabled,
  className,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: IconButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    isLoading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading || undefined}
    >
      <span
        className={[styles.icon, isLoading ? styles.hiddenIcon : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {icon}{" "}
      </span>

      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
    </button>
  );
}
