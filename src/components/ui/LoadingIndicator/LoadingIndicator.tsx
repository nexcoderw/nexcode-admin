import type { HTMLAttributes } from "react";

import styles from "./LoadingIndicator.module.css";

export type LoadingIndicatorSize = "sm" | "md" | "lg";

export type LoadingIndicatorVariant = "inline" | "section" | "fullscreen";

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
      <span className={styles.mark} aria-hidden="true">
        {" "}
        <span className={styles.bracket}>{"<"} </span>
        <span className={styles.signal}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
        <span className={styles.bracket}>{">"}</span>
        <span className={styles.cursor} />
      </span>
      <span className={showLabel ? styles.label : styles.srOnly}>{label}</span>
    </div>
  );
}
