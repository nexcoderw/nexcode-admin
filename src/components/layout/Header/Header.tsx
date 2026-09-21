"use client";

import {
  Logout01Icon,
  Menu01Icon,
  Notification02Icon,
  Search01Icon,
  Settings01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../ui/DropdownMenu/DropdownMenu";
import { Icon } from "../../ui/Icon/Icon";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Tooltip } from "../../ui/Tooltip/Tooltip";

import styles from "./Header.module.css";

export interface HeaderAdmin {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface HeaderProps {
  /**

* Current page title.
  */
  title: string;

  /**

* Optional contextual information displayed before the title.
  */
  eyebrow?: string;

  /**

* Optional content displayed beside the title.
  */
  titleAccessory?: ReactNode;

  /**

* Optional custom search control.
*
* The Header does not own search state.
  */
  search?: ReactNode;

  /**

* Current administrator information.
  */
  admin: HeaderAdmin;

  /**

* Number displayed on the notification control.
  */
  notificationCount?: number;

  /**

* Called when the notification button is selected.
  */
  onNotificationsClick?: () => void;

  /**

* Opens the mobile navigation drawer.
  */
  onMenuClick?: () => void;

  /**

* Called when Sign out is selected.
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

* Optional actions displayed between search and utility controls.
  */
  actions?: ReactNode;
}

export function Header({
  title,
  eyebrow,
  titleAccessory,
  search,
  admin,
  notificationCount = 0,
  onNotificationsClick,
  onMenuClick,
  onSignOut,
  profileHref = "/profile",
  settingsHref = "/settings",
  actions,
}: HeaderProps) {
  const initials = getInitials(admin.name);

  const visibleNotificationCount =
    notificationCount > 99 ? "99+" : notificationCount;

  return (
    <header className={styles.header}>
      {" "}
      <div className={styles.leading}>
        {onMenuClick && (
          <div className={styles.mobileMenu}>
            <IconButton
              icon={<Icon icon={Menu01Icon} />}
              aria-label="Open navigation"
              variant="ghost"
              onClick={onMenuClick}
            />{" "}
          </div>
        )}

        <div className={styles.pageContext}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}

          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>

            {titleAccessory && (
              <div className={styles.titleAccessory}>{titleAccessory}</div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.trailing}>
        {search && <div className={styles.search}>{search}</div>}

        {actions && <div className={styles.actions}>{actions}</div>}

        {!search && (
          <Tooltip content="Search" placement="bottom">
            <IconButton
              icon={<Icon icon={Search01Icon} />}
              aria-label="Search"
              variant="ghost"
              className={styles.compactSearch}
            />
          </Tooltip>
        )}

        <Tooltip content="Notifications" placement="bottom">
          <span className={styles.notificationWrapper}>
            <IconButton
              icon={<Icon icon={Notification02Icon} />}
              aria-label={
                notificationCount > 0
                  ? `${notificationCount} unread notifications`
                  : "Notifications"
              }
              variant="ghost"
              onClick={onNotificationsClick}
            />

            {notificationCount > 0 && (
              <span className={styles.notificationBadge} aria-hidden="true">
                {visibleNotificationCount}
              </span>
            )}
          </span>
        </Tooltip>

        <div className={styles.divider} aria-hidden="true" />

        <DropdownMenu
          label="Administrator account"
          align="end"
          trigger={
            <button
              type="button"
              className={styles.accountTrigger}
              aria-label={`Open account menu for ${admin.name}`}
            >
              <Avatar
                name={admin.name}
                avatarUrl={admin.avatarUrl}
                initials={initials}
              />

              <span className={styles.accountDetails}>
                <span className={styles.accountName}>{admin.name}</span>

                <span className={styles.accountRole}>Administrator</span>
              </span>
            </button>
          }
        >
          <DropdownMenuLabel>
            <span className={styles.menuIdentity}>
              <span className={styles.menuIdentityName}>{admin.name}</span>

              {admin.email && (
                <span className={styles.menuIdentityEmail}>{admin.email}</span>
              )}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem icon={<Icon icon={UserCircleIcon} />}>
            <Link href={profileHref} className={styles.menuLink}>
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem icon={<Icon icon={Settings01Icon} />}>
            <Link href={settingsHref} className={styles.menuLink}>
              Settings
            </Link>
          </DropdownMenuItem>

          {onSignOut && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                icon={<Icon icon={Logout01Icon} />}
                destructive
                onSelect={onSignOut}
              >
                Sign out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
}

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  initials: string;
}

function Avatar({ name, avatarUrl, initials }: AvatarProps) {
  if (avatarUrl) {
    return (
      <span className={styles.avatar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}{" "}
        <img src={avatarUrl} alt="" className={styles.avatarImage} />{" "}
      </span>
    );
  }

  return (
    <span className={styles.avatar} aria-hidden="true" title={name}>
      {initials}{" "}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}
