import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

import styles from "./Input.module.css";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**

* Visible field label.
  */
  label: string;

  /**

* Optional Hugeicons icon displayed on the left.
  */
  leftIcon?: ReactNode;

  /**

* Optional content displayed on the right.
*
* This can be used for controls such as a password
* visibility toggle.
  */
  rightElement?: ReactNode;

  /**

* Supporting information displayed below the field.
  */
  helperText?: string;

  /**

* Validation error displayed below the field.
*
* When present, the field automatically receives the
* appropriate invalid accessibility state.
  */
  error?: string;

  /**

* Displays an "Optional" indicator beside the label.
*
* This should only be used when distinguishing optional
* fields is useful within the surrounding form.
  */
  showOptional?: boolean;
}

export function Input({
  id,
  label,
  leftIcon,
  rightElement,
  helperText,
  error,
  showOptional = false,
  required,
  disabled,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = useId();

  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const descriptionIds =
    [
      ariaDescribedBy,
      helperText && !error ? helperId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const wrapperClasses = [
    styles.control,
    leftIcon ? styles.hasLeftIcon : "",
    rightElement ? styles.hasRightElement : "",
    error ? styles.hasError : "",
    disabled ? styles.isDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [styles.input, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      {" "}
      <div className={styles.labelRow}>
        {" "}
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && (
            <>
              <span className={styles.required} aria-hidden="true">
                *
              </span>
              <span className={styles.srOnly}> required</span>
            </>
          )}
        </label>
        {!required && showOptional && (
          <span className={styles.optional}>Optional</span>
        )}
      </div>
      <div className={wrapperClasses}>
        {leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          className={inputClasses}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionIds}
        />

        {rightElement && (
          <span className={styles.rightElement}>{rightElement}</span>
        )}
      </div>
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
