import Link, { type LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
  className?: string;
}

type ButtonElementProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
  };

type ButtonLinkProps = ButtonBaseProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "href"
  > & {
    href: LinkProps["href"];
    disabled?: boolean;
    type?: never;
  };

export type ButtonProps = ButtonElementProps | ButtonLinkProps;

export function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingLabel = "Loading",
  fullWidth = false,
  iconOnly = false,
  disabled = false,
  className,
  href,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    iconOnly ? styles.iconOnly : "",
    isLoading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span
        className={[
          styles.content,
          isLoading ? styles.hiddenContent : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={isLoading || undefined}
      >
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span className={iconOnly ? styles.visuallyHidden : undefined}>
          {children}
        </span>

        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </span>

      {isLoading && (
        <span className={styles.loadingDots} aria-hidden="true">
          <span className={styles.loadingLink} />
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    const linkProps =
      props as AnchorHTMLAttributes<HTMLAnchorElement>;

    const {
      onClick,
      tabIndex,
      ...remainingLinkProps
    } = linkProps;

    return (
      <Link
        {...remainingLinkProps}
        href={href}
        className={classes}
        aria-label={isLoading ? loadingLabel : ariaLabel}
        aria-busy={isLoading || undefined}
        aria-disabled={disabled || isLoading || undefined}
        tabIndex={disabled || isLoading ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled || isLoading) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
      >
        {content}
      </Link>
    );
  }

  const buttonProps =
    props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-label={isLoading ? loadingLabel : ariaLabel}
      aria-busy={isLoading || undefined}
    >
      {content}
    </button>
  );
}