'use client';

import {
  ArrowDown01Icon,
  Logout01Icon,
  Notification02Icon,
  Settings01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type {
  ReactNode,
} from 'react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ADMIN_NAVIGATION,
  type AdminNavigationGroup,
  type AdminNavigationItem,
} from '../../../constants/admin-navigation';
import { ROUTES } from '../../../constants/routes';
import { Icon } from '../../ui/Icon/Icon';
import { IconButton } from '../../ui/IconButton/IconButton';

import styles from './Header.module.css';

export interface HeaderAdmin {
  name: string;
  email?: string;
}

export interface HeaderProps {
  admin: HeaderAdmin;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onSignOut?: () => void;
  actions?: ReactNode;
}

export function Header({
  admin,
  notificationCount = 0,
  onNotificationsClick,
  onSignOut,
  actions,
}: HeaderProps) {
  const pathname = usePathname();

  const [openGroup, setOpenGroup] =
    useState<string | null>(null);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenGroup(null);
        setAccountOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setOpenGroup(null);
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    );

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );

      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setAccountOpen(false);
  }, [pathname]);

  const initials = getInitials(admin.name);

  const visibleNotificationCount =
    notificationCount > 99
      ? '99+'
      : notificationCount;

  return (
    <header
      ref={headerRef}
      className={styles.header}
    >
      <Link
        href={ROUTES.admin.dashboard}
        className={styles.brand}
        aria-label="NEXCODE dashboard"
      >
        <span
          className={styles.brandMark}
          aria-hidden="true"
        >
          N
        </span>

        <span className={styles.brandName}>
          NEXCODE
        </span>
      </Link>

      <nav
        className={styles.navigation}
        aria-label="Administration"
      >
        <div className={styles.navigationRail}>
          {ADMIN_NAVIGATION.map((group) => (
            <HeaderNavigationGroup
              key={group.label}
              group={group}
              pathname={pathname}
              open={openGroup === group.label}
              onToggle={() => {
                setAccountOpen(false);

                setOpenGroup((current) =>
                  current === group.label
                    ? null
                    : group.label,
                );
              }}
            />
          ))}
        </div>
      </nav>

      <div className={styles.utilities}>
        {actions}

        <div className={styles.notification}>
          <IconButton
            icon={
              <Icon
                icon={Notification02Icon}
                size={19}
              />
            }
            aria-label={
              notificationCount > 0
                ? `${notificationCount} unread notifications`
                : 'Notifications'
            }
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
          />

          {notificationCount > 0 && (
            <span
              className={styles.notificationCount}
              aria-hidden="true"
            >
              {visibleNotificationCount}
            </span>
          )}
        </div>

        <div className={styles.account}>
          <button
            type="button"
            className={styles.avatarButton}
            aria-label={`Open account menu for ${admin.name}`}
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            onClick={() => {
              setOpenGroup(null);

              setAccountOpen((current) => !current);
            }}
          >
            <span className={styles.avatar}>
              {initials}
            </span>
          </button>

          {accountOpen && (
            <div
              className={styles.accountMenu}
              role="menu"
            >
              <div className={styles.accountIdentity}>
                <strong>{admin.name}</strong>

                {admin.email && (
                  <span>{admin.email}</span>
                )}
              </div>

              <div className={styles.menuDivider} />

              <Link
                href="/profile"
                className={styles.accountMenuItem}
                role="menuitem"
              >
                <Icon
                  icon={UserCircleIcon}
                  size={18}
                />

                <span>Profile</span>
              </Link>

              <Link
                href={ROUTES.admin.settings}
                className={styles.accountMenuItem}
                role="menuitem"
              >
                <Icon
                  icon={Settings01Icon}
                  size={18}
                />

                <span>Settings</span>
              </Link>

              {onSignOut && (
                <>
                  <div
                    className={styles.menuDivider}
                  />

                  <button
                    type="button"
                    className={[
                      styles.accountMenuItem,
                      styles.signOut,
                    ].join(' ')}
                    role="menuitem"
                    onClick={onSignOut}
                  >
                    <Icon
                      icon={Logout01Icon}
                      size={18}
                    />

                    <span>Sign out</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface HeaderNavigationGroupProps {
  group: AdminNavigationGroup;
  pathname: string;
  open: boolean;
  onToggle: () => void;
}

function HeaderNavigationGroup({
  group,
  pathname,
  open,
  onToggle,
}: HeaderNavigationGroupProps) {
  const groupActive = group.items.some(
    (item) =>
      isNavigationItemActive(
        pathname,
        item,
      ),
  );

  if (group.items.length === 1) {
    const item = group.items[0];

    return (
      <Link
        href={item.href}
        className={[
          styles.navigationItem,
          groupActive
            ? styles.navigationItemActive
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-current={
          groupActive ? 'page' : undefined
        }
      >
        <span
          className={styles.navigationIcon}
          aria-hidden="true"
        >
          {group.icon}
        </span>

        <span>{group.label}</span>
      </Link>
    );
  }

  return (
    <div className={styles.navigationGroup}>
      <button
        type="button"
        className={[
          styles.navigationItem,
          groupActive
            ? styles.navigationItemActive
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span
          className={styles.navigationIcon}
          aria-hidden="true"
        >
          {group.icon}
        </span>

        <span>{group.label}</span>

        <Icon
          icon={ArrowDown01Icon}
          size={13}
          className={[
            styles.chevron,
            open ? styles.chevronOpen : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </button>

      {open && (
        <div
          className={styles.navigationMenu}
          role="menu"
        >
          {group.items.map((item) => {
            const active =
              isNavigationItemActive(
                pathname,
                item,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={[
                  styles.navigationMenuItem,
                  active
                    ? styles.navigationMenuItemActive
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span
                  className={styles.menuIcon}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function isNavigationItemActive(
  pathname: string,
  item: AdminNavigationItem,
) {
  if (item.exact || item.href === '/') {
    return pathname === item.href;
  }

  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}