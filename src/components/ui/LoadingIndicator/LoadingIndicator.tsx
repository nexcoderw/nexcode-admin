import type { HTMLAttributes } from "react";

import styles from "./LoadingIndicator.module.css";

export type LoadingIndicatorSize = "sm" | "md" | "lg";

export type LoadingIndicatorVariant = "inline" | "section" | "fullscreen";

export interface LoadingMarkProps {
  /**

* Controls the loading mark dimensions.
*
* @default "md"
  */
  size?: LoadingIndicatorSize;

  /**

* Additional class applied to the loading mark.
  */
  className?: string;
}

export interface LoadingIndicatorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /**

* Accessible loading message.
*
* @default "Loading"
  */
  label?: string;

  /**

* Controls the loader dimensions.
*
* @default "md"
  */
  size?: LoadingIndicatorSize;

  /**

* Controls how much layout space the loader occupies.
*
* @default "inline"
  */
  variant?: LoadingIndicatorVariant;

  /**

* Shows the loading label visually.
*
* The label remains available to assistive technologies
* when this is false.
*
* @default false
  */
  showLabel?: boolean;
}

/**

* Visual NEXCODE loading mark.
*
* This component is intentionally presentation-only. Use it inside
* components that already provide their own loading semantics, such
* as Button and IconButton.
  */
export function LoadingMark({ size = "md", className }: LoadingMarkProps) {
  const classes = [
    styles.mark,
    styles[`mark${capitalize(size)}`],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} aria-hidden="true">
      {" "}
      <span className={styles.bracket}>{"<"}</span>
      <span className={styles.signal}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </span>
      <span className={styles.bracket}>{">"}</span>
      <span className={styles.cursor} />
    </span>
  );
}

export function LoadingIndicator({
  label = "Loading",
  size = "md",
  variant = "inline",
  showLabel = false,
  className,
  ...props
}: LoadingIndicatorProps) {
  const classes = [
    styles.loader,
    styles[size],
    styles[variant],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
      className={classes}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {" "}
      <LoadingMark size={size} />
      <span className={showLabel ? styles.label : styles.srOnly}>{label}</span>
    </div>
  );
}

function capitalize(value: LoadingIndicatorSize) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
