"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";

import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";

import styles from "./Dialog.module.css";

export type DialogSize = "sm" | "md" | "lg";

export interface DialogProps extends Omit<
  HTMLAttributes<HTMLDialogElement>,
  "title"
> {
  /**

* Controls whether the dialog is open.
  */
  open: boolean;

  /**

* Called when the dialog should close.
  */
  onClose: () => void;

  /**

* Primary dialog heading.
  */
  title: ReactNode;

  /**

* Optional supporting text displayed below the title.
  */
  description?: ReactNode;

  /**

* Main dialog content.
  */
  children: ReactNode;

  /**

* Optional footer content.
*
* Usually contains Button components.
  */
  footer?: ReactNode;

  /**

* Controls the maximum dialog width.
*
* @default "md"
  */
  size?: DialogSize;

  /**

* Accessible label for the close button.
*
* @default "Close dialog"
  */
  closeLabel?: string;

  /**

* Controls whether clicking the backdrop closes the dialog.
*
* @default true
  */
  closeOnBackdrop?: boolean;

  /**

* Shows the close button in the header.
*
* @default true
  */
  showCloseButton?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeLabel = "Close dialog",
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
  ...props
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const generatedId = useId();

  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const classes = [styles.dialog, styles[size], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      {...props}
      ref={dialogRef}
      className={classes}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {" "}
      <div className={styles.container}>
        {" "}
        <header className={styles.header}>
          {" "}
          <div className={styles.heading}>
            {" "}
            <h2 id={titleId} className={styles.title}>
              {title}{" "}
            </h2>
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <IconButton
              icon={<Icon icon={Cancel01Icon} />}
              aria-label={closeLabel}
              variant="ghost"
              size="sm"
              className={styles.closeButton}
              onClick={onClose}
            />
          )}
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}
