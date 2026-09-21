import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "role"
> {
  /**

* Primary label displayed beside the switch.
  */
  label: ReactNode;

  /**

* Optional supporting text displayed below the label.
  */
  description?: ReactNode;

  /**

* Validation error displayed below the control.
  */
  error?: string;
}

export function Switch({
  id,
  label,
  description,
  error,
  disabled,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SwitchProps) {
  const generatedId = useId();

  const switchId = id ?? generatedId;
  const descriptionId = `${switchId}-description`;
  const errorId = `${switchId}-error`;

  const descriptionIds =
    [
      ariaDescribedBy,
      description && !error ? descriptionId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const wrapperClasses = [
    styles.switch,
    error ? styles.hasError : "",
    disabled ? styles.isDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [styles.input, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      {" "}
      <label className={styles.control} htmlFor={switchId}>
        {" "}
        <span className={styles.content}>
          {" "}
          <span className={styles.label}>{label}</span>
          {description && !error && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </span>
        <span className={styles.switchControl}>
          <input
            {...props}
            id={switchId}
            type="checkbox"
            role="switch"
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionIds}
          />

          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb} />
          </span>
        </span>
      </label>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
