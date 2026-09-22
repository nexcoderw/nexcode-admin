import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingLabel = "Loading",
  fullWidth = false,
  disabled,
  className,
  type = "button",
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

  return (
    <button
      {...props}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-label={isLoading ? loadingLabel : props["aria-label"]}
    >
      <span
        className={[styles.content, isLoading ? styles.hiddenContent : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={isLoading || undefined}
      >
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span>{children}</span>

        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </span>
      {isLoading && <span className={styles.loadingDots} aria-hidden="true" />}
    </button>
  );
}
