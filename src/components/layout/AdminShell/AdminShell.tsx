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

import { ADMIN_SIDEBAR_NAVIGATION } from "../../../constants/admin-sidebar";
import { ROUTES } from "../../../constants/routes";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import type { HeaderAdmin, HeaderProps } from "../Header/Header";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

import styles from "./AdminShell.module.css";

export interface AdminShellProps {
  /**
   * Page content rendered inside the main admin workspace.
   */
  children: ReactNode;

  /**
   * Current page title displayed in the Header.
   */
  title: string;

  /**
   * Optional contextual text displayed above the page title.
   */
  eyebrow?: string;

  /**
   * Optional content displayed beside the page title.
   */
  titleAccessory?: ReactNode;

  /**
   * Current authenticated administrator.
   */
  admin: HeaderAdmin;

  /**
   * Optional search control displayed in the Header.
   *
   * Search state and behaviour remain owned by the page
   * or feature using the shell.
   */
  search?: ReactNode;

  /**
   * Optional page-specific Header actions.
   */
  headerActions?: ReactNode;

  /**
   * Optional content displayed in the Sidebar footer.
   */
  sidebarFooter?: ReactNode;

  /**
   * Number of unread notifications.
   *
   * @default 0
   */
  notificationCount?: number;

  /**
   * Called when the notifications control is selected.
   */
  onNotificationsClick?: () => void;

  /**
   * Called when the administrator signs out.
   */
  onSignOut?: () => void;

  /**
   * Profile destination.
   *
   * This can later be moved to ROUTES when the
   * administrator profile page is implemented.
   *
   * @default "/profile"
   */
  profileHref?: string;

  /**
   * Initial desktop Sidebar collapsed state.
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
  admin,
  search,
  headerActions,
  sidebarFooter,
  notificationCount = 0,
  onNotificationsClick,
  onSignOut,
  profileHref = "/profile",
  defaultSidebarCollapsed = false,
}: AdminShellProps) {
  const pathname = usePathname();
  const mobileNavigationId = useId();

  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  /*
   * Close mobile navigation automatically whenever
   * navigation changes to another page.
   */
  useEffect(() => {
    setMobileNavigationOpen(false);
  }, [pathname]);

  /*
   * Prevent the document behind the mobile drawer from
   * scrolling while navigation is open.
   *
   * Escape also closes the drawer.
   */
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
    settingsHref: ROUTES.admin.settings,
  };

  return (
    <div className={styles.shell}>
      <div className={styles.desktopSidebar}>
        <Sidebar
          navigation={ADMIN_SIDEBAR_NAVIGATION}
          footerContent={sidebarFooter}
          settingsHref={ROUTES.admin.settings}
          onSignOut={onSignOut}
          defaultCollapsed={defaultSidebarCollapsed}
        />
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
        pathname={pathname}
        onClose={closeMobileNavigation}
        onSignOut={onSignOut}
      />
    </div>
  );
}

/* =========================================================
 * Mobile Navigation
 * ======================================================= */

interface MobileNavigationProps {
  id: string;
  open: boolean;
  pathname: string;
  onClose: () => void;
  onSignOut?: () => void;
}

function MobileNavigation({
  id,
  open,
  pathname,
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
          <Link
            href={ROUTES.admin.dashboard}
            className={styles.brand}
            onClick={onClose}
          >
            <span className={styles.brandMark} aria-hidden="true">
              N
            </span>

            <span className={styles.brandText}>
              <strong>NEXCODE</strong>

              <span>Admin</span>
            </span>
          </Link>

          <IconButton
            icon={<Icon icon={Cancel01Icon} size={20} />}
            aria-label="Close navigation"
            variant="ghost"
            onClick={onClose}
          />
        </div>

        <nav className={styles.drawerNavigation} aria-label="Mobile navigation">
          {ADMIN_SIDEBAR_NAVIGATION.map((group, groupIndex) => (
            <div
              key={`${group.label ?? "navigation"}-${groupIndex}`}
              className={styles.drawerGroup}
            >
              {group.label && (
                <span className={styles.drawerGroupLabel}>{group.label}</span>
              )}

              <ul className={styles.drawerList}>
                {group.items.map((item) => {
                  const active = isNavigationItemActive(
                    pathname,
                    item.href,
                    item.exact,
                  );

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
            href={ROUTES.admin.settings}
            className={[
              styles.drawerItem,
              isNavigationItemActive(pathname, ROUTES.admin.settings)
                ? styles.drawerItemActive
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={
              isNavigationItemActive(pathname, ROUTES.admin.settings)
                ? "page"
                : undefined
            }
            onClick={onClose}
          >
            <span className={styles.drawerItemIcon} aria-hidden="true">
              <Icon icon={Settings01Icon} size={20} />
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
                <Icon icon={Logout01Icon} size={20} />
              </span>

              <span className={styles.drawerItemLabel}>Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

/* =========================================================
 * Helpers
 * ======================================================= */

function isNavigationItemActive(pathname: string, href: string, exact = false) {
  if (exact || href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
