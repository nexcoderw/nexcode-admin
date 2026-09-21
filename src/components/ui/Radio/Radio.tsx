import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

import styles from "./Radio.module.css";

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /**

* Primary label displayed beside the radio.
  */
  label: ReactNode;

  /**

* Optional supporting text displayed below the label.
  */
  description?: ReactNode;

  /**

* Validation error displayed below the control.
*
* Group-level validation should normally be handled by
* the parent fieldset when multiple radios belong together.
  */
  error?: string;
}

export function Radio({
  id,
  label,
  description,
  error,
  disabled,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: RadioProps) {
  const generatedId = useId();

  const radioId = id ?? generatedId;
  const descriptionId = `${radioId}-description`;
  const errorId = `${radioId}-error`;

  const descriptionIds =
    [
      ariaDescribedBy,
      description && !error ? descriptionId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const wrapperClasses = [
    styles.radio,
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
      <label className={styles.control} htmlFor={radioId}>
        {" "}
        <span className={styles.radioControl}>
          <input
            {...props}
            id={radioId}
            type="radio"
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionIds}
          />
          <span className={styles.visual} aria-hidden="true">
            <span className={styles.indicator} />
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
