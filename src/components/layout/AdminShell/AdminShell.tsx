"use client";

import {
  Cancel01Icon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";

import type { HeaderAdmin, HeaderProps } from "../Header/Header";
import { Header } from "../Header/Header";
import type { SidebarNavigationGroup } from "../Sidebar/Sidebar";
import { Sidebar } from "../Sidebar/Sidebar";

import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";

import styles from "./AdminShell.module.css";

export interface AdminShellProps {
  children: ReactNode;

  /**

* Current page title displayed in the Header.
  */
  title: string;

  /**

* Optional context displayed above the page title.
  */
  eyebrow?: string;

  /**

* Optional content displayed beside the title.
  */
  titleAccessory?: ReactNode;

  /**

* Admin navigation configuration.
  */
  navigation: SidebarNavigationGroup[];

  /**

* Current administrator.
  */
  admin: HeaderAdmin;

  /**

* Optional search component rendered in the Header.
  */
  search?: ReactNode;

  /**

* Optional page-level Header actions.
  */
  headerActions?: ReactNode;

  /**

* Optional Sidebar footer content.
  */
  sidebarFooter?: ReactNode;

  /**

* Unread notification count.
  */
  notificationCount?: number;

  /**

* Notification interaction.
  */
  onNotificationsClick?: () => void;

  /**

* Sign-out interaction.
  */
  onSignOut?: () => void;

  /**

* Profile destination.
*
* @default "/profile"
  */
  profileHref?: string;

  /**

* Settings destination.
*
* @default "/settings"
  */
  settingsHref?: string;

  /**

* Controls the initial desktop Sidebar state.
*
* @default false
  */
  defaultSidebarCollapsed?: boolean;
}

export function AdminShell({
  children,
  title,
  eyebrow,
  titleAccessory,
  navigation,
  admin,
  search,
  headerActions,
  sidebarFooter,
  notificationCount = 0,
  onNotificationsClick,
  onSignOut,
  profileHref = "/profile",
  settingsHref = "/settings",
  defaultSidebarCollapsed = false,
}: AdminShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const pathname = usePathname();
  const mobileNavigationId = useId();

  useEffect(() => {
    setMobileNavigationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavigationOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavigationOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileNavigationOpen]);

  const openMobileNavigation = () => {
    setMobileNavigationOpen(true);
  };

  const closeMobileNavigation = () => {
    setMobileNavigationOpen(false);
  };

  const headerProps: HeaderProps = {
    title,
    eyebrow,
    titleAccessory,
    search,
    actions: headerActions,
    admin,
    notificationCount,
    onNotificationsClick,
    onMenuClick: openMobileNavigation,
    onSignOut,
    profileHref,
    settingsHref,
  };

  return (
    <div className={styles.shell}>
      {" "}
      <div className={styles.desktopSidebar}>
        {" "}
        <Sidebar
          navigation={navigation}
          footerContent={sidebarFooter}
          settingsHref={settingsHref}
          onSignOut={onSignOut}
          defaultCollapsed={defaultSidebarCollapsed}
        />{" "}
      </div>
      <div className={styles.workspace}>
        <Header {...headerProps} />

        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>
      <MobileNavigation
        id={mobileNavigationId}
        open={mobileNavigationOpen}
        navigation={navigation}
        pathname={pathname}
        settingsHref={settingsHref}
        onClose={closeMobileNavigation}
        onSignOut={onSignOut}
      />
    </div>
  );
}

interface MobileNavigationProps {
  id: string;
  open: boolean;
  navigation: SidebarNavigationGroup[];
  pathname: string;
  settingsHref: string;
  onClose: () => void;
  onSignOut?: () => void;
}

function MobileNavigation({
  id,
  open,
  navigation,
  pathname,
  settingsHref,
  onClose,
  onSignOut,
}: MobileNavigationProps) {
  return (
    <div
      className={[
        styles.mobileNavigation,
        open ? styles.mobileNavigationOpen : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside
        id={id}
        className={styles.drawer}
        aria-label="Mobile administration navigation"
      >
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.brand} onClick={onClose}>
            <span className={styles.brandMark} aria-hidden="true">
              N
            </span>

            <span className={styles.brandText}>
              <strong>NEXCODE</strong>
              <span>Admin</span>
            </span>
          </Link>

          <IconButton
            icon={<Icon icon={Cancel01Icon} />}
            aria-label="Close navigation"
            variant="ghost"
            onClick={onClose}
          />
        </div>

        <nav className={styles.drawerNavigation} aria-label="Mobile navigation">
          {navigation.map((group, groupIndex) => (
            <div
              key={`${group.label ?? "navigation"}-${groupIndex}`}
              className={styles.drawerGroup}
            >
              {group.label && (
                <span className={styles.drawerGroupLabel}>{group.label}</span>
              )}

              <ul className={styles.drawerList}>
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href, item.exact);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          styles.drawerItem,
                          active ? styles.drawerItemActive : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-current={active ? "page" : undefined}
                        onClick={onClose}
                      >
                        <span
                          className={styles.drawerItemIcon}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>

                        <span className={styles.drawerItemLabel}>
                          {item.label}
                        </span>

                        {item.badge && (
                          <span className={styles.drawerItemBadge}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.drawerFooter}>
          <Link
            href={settingsHref}
            className={[
              styles.drawerItem,
              isActive(pathname, settingsHref, false)
                ? styles.drawerItemActive
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={onClose}
          >
            <span className={styles.drawerItemIcon} aria-hidden="true">
              <Icon icon={Settings01Icon} />
            </span>

            <span className={styles.drawerItemLabel}>Settings</span>
          </Link>

          {onSignOut && (
            <button
              type="button"
              className={[styles.drawerItem, styles.signOut].join(" ")}
              onClick={() => {
                onClose();
                onSignOut();
              }}
            >
              <span className={styles.drawerItemIcon} aria-hidden="true">
                <Icon icon={Logout01Icon} />
              </span>

              <span className={styles.drawerItemLabel}>Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function isActive(pathname: string, href: string, exact = false) {
  if (exact || href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
