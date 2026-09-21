import type { ButtonHTMLAttributes, ReactNode } from "react";

import { LoadingMark } from "../LoadingIndicator/LoadingIndicator";

import styles from "./IconButton.module.css";

export type IconButtonVariant = "default" | "ghost" | "primary" | "danger";

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> {
  icon: ReactNode;
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
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
      {isLoading ? (
        <LoadingMark size="sm" />
      ) : (
        <span className={styles.icon} aria-hidden="true">
          {icon}{" "}
        </span>
      )}{" "}
    </button>
  );
}
