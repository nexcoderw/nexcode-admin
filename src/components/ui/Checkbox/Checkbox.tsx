import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /**

* Primary label displayed beside the checkbox.
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

export function Checkbox({
  id,
  label,
  description,
  error,
  disabled,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const generatedId = useId();

  const checkboxId = id ?? generatedId;
  const descriptionId = `${checkboxId}-description`;
  const errorId = `${checkboxId}-error`;

  const descriptionIds =
    [
      ariaDescribedBy,
      description && !error ? descriptionId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const wrapperClasses = [
    styles.checkbox,
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
      <label className={styles.control} htmlFor={checkboxId}>
        {" "}
        <span className={styles.checkboxControl}>
          <input
            {...props}
            id={checkboxId}
            type="checkbox"
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionIds}
          />
          <span className={styles.visual} aria-hidden="true">
            <span className={styles.checkmark} />
          </span>
        </span>
        <span className={styles.content}>
          <span className={styles.label}>{label}</span>

          {description && !error && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
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
