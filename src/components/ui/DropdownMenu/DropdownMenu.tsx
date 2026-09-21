"use client";

import type { KeyboardEvent, ReactNode } from "react";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./DropdownMenu.module.css";

export type DropdownMenuAlign = "start" | "end";

export interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: DropdownMenuAlign;
  label?: string;
}

export interface DropdownMenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuLabelProps {
  children: ReactNode;
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  label = "Actions",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const firstItem = getEnabledItems(menu)[0];

    firstItem?.focus();
  }, [open]);

  const handleTriggerClick = () => {
    setOpen((current) => !current);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const items = getEnabledItems(menu);

    if (items.length === 0) {
      return;
    }

    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement,
    );

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();

        const nextIndex =
          currentIndex < items.length - 1 ? currentIndex + 1 : 0;

        items[nextIndex]?.focus();
        break;
      }

      case "ArrowUp": {
        event.preventDefault();

        const previousIndex =
          currentIndex > 0 ? currentIndex - 1 : items.length - 1;

        items[previousIndex]?.focus();
        break;
      }

      case "Home": {
        event.preventDefault();
        items[0]?.focus();
        break;
      }

      case "End": {
        event.preventDefault();
        items.at(-1)?.focus();
        break;
      }

      case "Escape": {
        event.preventDefault();
        setOpen(false);
        break;
      }
    }
  };

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement<DropdownMenuItemProps>(child)) {
      return child;
    }

    if (child.type !== DropdownMenuItem) {
      return child;
    }

    const originalOnSelect = child.props.onSelect;

    return cloneElement(child, {
      onSelect: () => {
        originalOnSelect?.();
        setOpen(false);
      },
    });
  });

  const triggerElement = isValidElement<{
    onClick?: () => void;
    "aria-haspopup"?: "menu";
    "aria-expanded"?: boolean;
    "aria-controls"?: string;
  }>(trigger)
    ? cloneElement(trigger, {
        onClick: handleTriggerClick,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
      })
    : null;

  if (!triggerElement) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.dropdown}>
      {triggerElement}

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          className={[styles.menu, styles[align]].join(" ")}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
        >
          {enhancedChildren}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  icon,
  shortcut,
  disabled = false,
  destructive = false,
  onSelect,
}: DropdownMenuItemProps) {
  const classes = [styles.item, destructive ? styles.destructive : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      onClick={onSelect}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}{" "}
        </span>
      )}

      <span className={styles.itemLabel}>{children}</span>

      {shortcut && (
        <span className={styles.shortcut} aria-hidden="true">
          {shortcut}
        </span>
      )}
    </button>
  );
}

export function DropdownMenuLabel({ children }: DropdownMenuLabelProps) {
  return <div className={styles.menuLabel}>{children} </div>;
}

export function DropdownMenuSeparator({
  className,
}: DropdownMenuSeparatorProps) {
  return (
    <div
      className={[styles.separator, className ?? ""].filter(Boolean).join(" ")}
      role="separator"
    />
  );
}

function getEnabledItems(menu: HTMLDivElement): HTMLButtonElement[] {
  return Array.from(
    menu.querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]:not(:disabled)',
    ),
  );
}
