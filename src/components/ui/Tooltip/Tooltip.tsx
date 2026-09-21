"use client";

import type {
  FocusEventHandler,
  HTMLAttributes,
  PointerEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./Tooltip.module.css";

type TooltipPlacement = "top" | "right" | "bottom" | "left";

interface TooltipTriggerProps {
  "aria-describedby"?: string;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
}

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children" | "content"
> {
  children: ReactElement;
  content: ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
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

  const tooltipId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const openTooltip = () => {
    clearOpenTimeout();

    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delay);
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

  /*
   * A disabled tooltip should behave exactly like its
   * original child. No cloning or extra wrapper is needed.
   */
  if (disabled) {
    return children;
  }

  /*
   * ReactNode values such as strings, fragments, null or
   * arrays do not expose trigger props. Tooltip requires a
   * single valid React element.
   */
  if (!isValidElement<TooltipTriggerProps>(children)) {
    return null;
  }

  const trigger = children;

  const existingDescribedBy = trigger.props["aria-describedby"];

  const describedBy = open
    ? [existingDescribedBy, tooltipId].filter(Boolean).join(" ")
    : existingDescribedBy;

  const triggerElement = cloneElement(trigger, {
    "aria-describedby": describedBy,

    onFocus: (event) => {
      trigger.props.onFocus?.(event);
      openTooltip();
    },

    onBlur: (event) => {
      trigger.props.onBlur?.(event);
      closeTooltip();
    },

    onPointerEnter: (event) => {
      trigger.props.onPointerEnter?.(event);
      openTooltip();
    },

    onPointerLeave: (event) => {
      trigger.props.onPointerLeave?.(event);
      closeTooltip();
    },
  });

  return (
    <span
      {...props}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      {triggerElement}

      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!open}
        className={[styles.tooltip, styles[placement], open ? styles.open : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={styles.content}>{content}</span>

        <span className={styles.arrow} aria-hidden="true" />
      </span>
    </span>
  );
}
