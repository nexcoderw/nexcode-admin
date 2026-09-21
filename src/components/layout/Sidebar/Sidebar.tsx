"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Tooltip } from "../../ui/Tooltip/Tooltip";

import styles from "./Sidebar.module.css";

export interface SidebarNavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
  exact?: boolean;
}

export interface SidebarNavigationGroup {
  label?: string;
  items: SidebarNavigationItem[];
}

export interface SidebarProps {
  navigation: SidebarNavigationGroup[];

  /**

* Optional content displayed in the footer above settings.
* Useful for workspace or account information.
  */
  footerContent?: ReactNode;

  /**

* Settings destination.
*
* @default "/settings"
  */
  settingsHref?: string;

  /**

* Called when the user selects Sign out.
  */
  onSignOut?: () => void;

  /**

* Initial desktop collapsed state.
*
* @default false
  */
  defaultCollapsed?: boolean;
}

export function Sidebar({
  navigation,
  footerContent,
  settingsHref = "/settings",
  onSignOut,
  defaultCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((current) => !current);
  };

  return (
    <aside
      className={[styles.sidebar, collapsed ? styles.collapsed : ""]
        .filter(Boolean)
        .join(" ")}
      aria-label="Administration navigation"
    >
      {" "}
      <div className={styles.header}>
        {" "}
        <Link
          href="/"
          className={styles.brand}
          aria-label="NEXCODE Admin dashboard"
        >
          {" "}
          <span className={styles.brandMark} aria-hidden="true">
            N{" "}
          </span>
          <span className={styles.brandContent}>
            <span className={styles.brandName}>NEXCODE</span>

            <span className={styles.brandProduct}>Admin</span>
          </span>
        </Link>
        <Tooltip
          content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          placement="right"
        >
          <IconButton
            icon={
              <Icon icon={collapsed ? ArrowRight01Icon : ArrowLeft01Icon} />
            }
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            variant="ghost"
            size="sm"
            className={styles.collapseButton}
            onClick={toggleCollapsed}
          />
        </Tooltip>
      </div>
      <div className={styles.navigationWrapper}>
        <nav className={styles.navigation} aria-label="Main navigation">
          {navigation.map((group, groupIndex) => (
            <div
              key={`${group.label ?? "navigation"}-${groupIndex}`}
              className={styles.group}
            >
              {group.label && (
                <div className={styles.groupLabel} aria-hidden={collapsed}>
                  <span>{group.label}</span>
                </div>
              )}

              <ul className={styles.list}>
                {group.items.map((item) => {
                  const active = isNavigationItemActive(pathname, item);

                  return (
                    <li key={item.href}>
                      <SidebarLink
                        item={item}
                        active={active}
                        collapsed={collapsed}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.footer}>
        {footerContent && (
          <div className={styles.footerContent}>{footerContent}</div>
        )}

        <div className={styles.footerActions}>
          <SidebarUtilityLink
            href={settingsHref}
            label="Settings"
            icon={<Icon icon={Settings01Icon} />}
            active={
              pathname === settingsHref ||
              pathname.startsWith(`${settingsHref}/`)
            }
            collapsed={collapsed}
          />

          {onSignOut && (
            <Tooltip content="Sign out" placement="right" disabled={!collapsed}>
              <button
                type="button"
                className={styles.utilityButton}
                onClick={onSignOut}
              >
                <span className={styles.itemIcon} aria-hidden="true">
                  <Icon icon={Logout01Icon} />
                </span>

                <span className={styles.itemLabel}>Sign out</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: SidebarNavigationItem;
  active: boolean;
  collapsed: boolean;
}

function SidebarLink({ item, active, collapsed }: SidebarLinkProps) {
  const link = (
    <Link
      href={item.href}
      className={[styles.item, active ? styles.active : ""]
        .filter(Boolean)
        .join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {" "}
      <span className={styles.itemIcon} aria-hidden="true">
        {item.icon}{" "}
      </span>
      <span className={styles.itemLabel}>{item.label}</span>
      {item.badge && <span className={styles.itemBadge}>{item.badge}</span>}
    </Link>
  );

  return (
    <Tooltip content={item.label} placement="right" disabled={!collapsed}>
      {link}{" "}
    </Tooltip>
  );
}

interface SidebarUtilityLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  collapsed: boolean;
}

function SidebarUtilityLink({
  href,
  label,
  icon,
  active,
  collapsed,
}: SidebarUtilityLinkProps) {
  return (
    <Tooltip content={label} placement="right" disabled={!collapsed}>
      <Link
        href={href}
        className={[styles.utilityButton, active ? styles.active : ""]
          .filter(Boolean)
          .join(" ")}
        aria-current={active ? "page" : undefined}
      >
        {" "}
        <span className={styles.itemIcon} aria-hidden="true">
          {icon}{" "}
        </span>
        <span className={styles.itemLabel}>{label}</span>
      </Link>
    </Tooltip>
  );
}

function isNavigationItemActive(pathname: string, item: SidebarNavigationItem) {
  if (item.exact) {
    return pathname === item.href;
  }

  if (item.href === "/") {
    return pathname === "/";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
