"use client";

import type {
  FocusEvent,
  HTMLAttributes,
  PointerEvent,
  ReactElement,
  ReactNode,
} from "react";
import { cloneElement, useEffect, useId, useRef, useState } from "react";

import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "content"
> {
  /**

* Element that receives the tooltip interaction.
*
* Prefer an interactive element such as Button or IconButton.
  */
  children: ReactElement;

  /**

* Text or content displayed inside the tooltip.
  */
  content: ReactNode;

  /**

* Position relative to the trigger.
*
* @default "top"
  */
  placement?: TooltipPlacement;

  /**

* Delay before displaying the tooltip in milliseconds.
*
* @default 350
  */
  delay?: number;

  /**

* Prevents the tooltip from opening.
*
* @default false
  */
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  placement = "top",
  delay = 350,
  disabled = false,
  className,
  ...props
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatedId = useId();
  const tooltipId = `${generatedId}-tooltip`;

  const clearOpenTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const openTooltip = () => {
    if (disabled) {
      return;
    }

    ```
clearOpenTimeout();

timeoutRef.current = setTimeout(() => {
  setOpen(true);
}, delay);
```;
  };

  const closeTooltip = () => {
    clearOpenTimeout();
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      clearOpenTimeout();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTooltip();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const child = cloneElement(
    children as ReactElement<{
      "aria-describedby"?: string;
      onFocus?: (event: FocusEvent<HTMLElement>) => void;
      onBlur?: (event: FocusEvent<HTMLElement>) => void;
      onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
      onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
    }>,
    {
      "aria-describedby":
        open && !disabled
          ? [children.props["aria-describedby"], tooltipId]
              .filter(Boolean)
              .join(" ")
          : children.props["aria-describedby"],

      onFocus: (event) => {
        children.props.onFocus?.(event);
        openTooltip();
      },

      onBlur: (event) => {
        children.props.onBlur?.(event);
        closeTooltip();
      },

      onPointerEnter: (event) => {
        children.props.onPointerEnter?.(event);
        openTooltip();
      },

      onPointerLeave: (event) => {
        children.props.onPointerLeave?.(event);
        closeTooltip();
      },
    },
  );

  const tooltipClasses = [
    styles.tooltip,
    styles[placement],
    open ? styles.visible : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={styles.root}>
      {child}

      {!disabled && (
        <span
          {...props}
          id={tooltipId}
          role="tooltip"
          className={tooltipClasses}
          aria-hidden={!open}
        >
          <span className={styles.content}>{content}</span>

          <span className={styles.arrow} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
