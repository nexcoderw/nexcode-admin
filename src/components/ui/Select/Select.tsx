import type { ReactNode, SelectHTMLAttributes } from "react";
import { useId } from "react";

import styles from "./Select.module.css";

export interface SelectOption {
  /**

* Value submitted by the select.
  */
  value: string;

  /**

* User-facing option label.
  */
  label: string;

  /**

* Prevents the option from being selected.
  */
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  /**

* Visible field label.
  */
  label: string;

  /**

* Options rendered by the native select.
  */
  options: SelectOption[];

  /**

* Optional placeholder shown as the first disabled option.
  */
  placeholder?: string;

  /**

* Optional Hugeicons icon displayed on the left.
  */
  leftIcon?: ReactNode;

  /**

* Supporting information displayed below the field.
  */
  helperText?: string;

  /**

* Validation error displayed below the field.
  */
  error?: string;

  /**

* Displays an "Optional" indicator beside the label.
  */
  showOptional?: boolean;
}

export function Select({
  id,
  label,
  options,
  placeholder,
  leftIcon,
  helperText,
  error,
  showOptional = false,
  required,
  disabled,
  className,
  defaultValue,
  value,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SelectProps) {
  const generatedId = useId();

  const selectId = id ?? generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const descriptionIds =
    [
      ariaDescribedBy,
      helperText && !error ? helperId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const controlClasses = [
    styles.control,
    leftIcon ? styles.hasLeftIcon : "",
    error ? styles.hasError : "",
    disabled ? styles.isDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selectClasses = [styles.select, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      {" "}
      <div className={styles.labelRow}>
        {" "}
        <label className={styles.label} htmlFor={selectId}>
          {label}
          ```
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
      <div className={controlClasses}>
        {leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <select
          {...props}
          id={selectId}
          className={selectClasses}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionIds}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className={styles.chevron} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
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
