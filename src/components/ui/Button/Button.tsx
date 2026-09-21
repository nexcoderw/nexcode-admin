import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**

* Visual treatment of the button.
*
* @default "primary"
  */
  variant?: ButtonVariant;

  /**

* Controls the height, padding and typography of the button.
*
* @default "md"
  */
  size?: ButtonSize;

  /**

* Optional Hugeicons icon rendered before the label.
  */
  leftIcon?: ReactNode;

  /**

* Optional Hugeicons icon rendered after the label.
  */
  rightIcon?: ReactNode;

  /**

* Displays the loading state and prevents interaction.
  */
  isLoading?: boolean;

  /**

* Accessible loading text.
*
* @default "Loading"
  */
  loadingLabel?: string;

  /**

* Expands the button to fill its container.
  */
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingLabel = "Loading",
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  style,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    isLoading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonStyle = {
    ...style,
    "--button-spinner-label": `"${loadingLabel}"`,
  } as CSSProperties;

  return (
    <button
      {...props}
      type={type}
      className={classes}
      style={buttonStyle}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading && (
        <>
          {" "}
          <span className={styles.spinner} aria-hidden="true" />{" "}
          <span className={styles.srOnly}>{loadingLabel}</span>
        </>
      )}
      {!isLoading && leftIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children && (
        <span
          className={
            isLoading ? `${styles.label} ${styles.hiddenLabel}` : styles.label
          }
        >
          {children}
        </span>
      )}
      {!isLoading && rightIcon && (
        <span className={styles.icon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
