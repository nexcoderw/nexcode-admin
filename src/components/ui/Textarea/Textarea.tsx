import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";

import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**

* Visible field label.
  */
  label: string;

  /**

* Supporting information displayed below the field.
  */
  helperText?: string;

  /**

* Validation error displayed below the field.
*
* When present, the textarea automatically receives
* the appropriate invalid accessibility state.
  */
  error?: string;

  /**

* Displays an "Optional" indicator beside the label.
*
* Use this only when distinguishing optional fields is
* useful within the surrounding form.
  */
  showOptional?: boolean;
}

export function Textarea({
  id,
  label,
  helperText,
  error,
  showOptional = false,
  required,
  disabled,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaProps) {
  const generatedId = useId();

  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const descriptionIds =
    [
      ariaDescribedBy,
      helperText && !error ? helperId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const textareaClasses = [
    styles.textarea,
    error ? styles.hasError : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      {" "}
      <div className={styles.labelRow}>
        {" "}
        <label className={styles.label} htmlFor={textareaId}>
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
      <textarea
        {...props}
        id={textareaId}
        className={textareaClasses}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionIds}
      />
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
