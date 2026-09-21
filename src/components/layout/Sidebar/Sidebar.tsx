'use client';

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Logout01Icon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Icon } from '../../ui/Icon/Icon';
import { IconButton } from '../../ui/IconButton/IconButton';
import { Tooltip } from '../../ui/Tooltip/Tooltip';

import styles from './Sidebar.module.css';

export interface SidebarNavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
  exact?: boolean;

  /**
   * Optional secondary label shown only when expanded.
   */
  description?: string;
}

export interface SidebarNavigationGroup {
  label?: string;
  items: SidebarNavigationItem[];
}

export interface SidebarProps {
  navigation: SidebarNavigationGroup[];
  footerContent?: ReactNode;
  onSignOut?: () => void;
  defaultCollapsed?: boolean;
}

export function Sidebar({
  navigation,
  footerContent,
  onSignOut,
  defaultCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(
    defaultCollapsed,
  );

  return (
    <aside
      className={[
        styles.sidebar,
        collapsed ? styles.collapsed : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Administration navigation"
    >
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="NEXCODE administration dashboard"
        >
          <span
            className={styles.brandMark}
            aria-hidden="true"
          >
            N
          </span>

          <span className={styles.brandIdentity}>
            <strong>NEXCODE</strong>
            <span>Control</span>
          </span>
        </Link>

        <Tooltip
          content={
            collapsed
              ? 'Expand navigation'
              : 'Collapse navigation'
          }
          placement="right"
        >
          <IconButton
            icon={
              <Icon
                icon={
                  collapsed
                    ? ArrowRight01Icon
                    : ArrowLeft01Icon
                }
                size={18}
              />
            }
            aria-label={
              collapsed
                ? 'Expand navigation'
                : 'Collapse navigation'
            }
            variant="ghost"
            size="sm"
            className={styles.collapseButton}
            onClick={() => {
              setCollapsed((current) => !current);
            }}
          />
        </Tooltip>
      </header>

      <nav
        className={styles.navigation}
        aria-label="Main administration navigation"
      >
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={`${group.label ?? 'group'}-${groupIndex}`}
            group={group}
            groupIndex={groupIndex}
            pathname={pathname}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <footer className={styles.footer}>
        {footerContent && (
          <div className={styles.footerContent}>
            {footerContent}
          </div>
        )}

        {onSignOut && (
          <Tooltip
            content="Sign out"
            placement="right"
            disabled={!collapsed}
          >
            <button
              type="button"
              className={[
                styles.navigationItem,
                styles.signOut,
              ].join(' ')}
              onClick={onSignOut}
            >
              <span
                className={styles.iconFrame}
                aria-hidden="true"
              >
                <Icon
                  icon={Logout01Icon}
                  size={20}
                />
              </span>

              <span className={styles.itemContent}>
                <span className={styles.itemLabel}>
                  Sign out
                </span>

                <span className={styles.itemDescription}>
                  End current session
                </span>
              </span>
            </button>
          </Tooltip>
        )}
      </footer>
    </aside>
  );
}

interface NavigationGroupProps {
  group: SidebarNavigationGroup;
  groupIndex: number;
  pathname: string;
  collapsed: boolean;
}

function NavigationGroup({
  group,
  groupIndex,
  pathname,
  collapsed,
}: NavigationGroupProps) {
  return (
    <section className={styles.group}>
      {group.label && (
        <div className={styles.groupHeading}>
          <span className={styles.groupNumber}>
            {String(groupIndex + 1).padStart(2, '0')}
          </span>

          <span className={styles.groupLabel}>
            {group.label}
          </span>

          <span
            className={styles.groupLine}
            aria-hidden="true"
          />
        </div>
      )}

      <ul className={styles.navigationList}>
        {group.items.map((item) => {
          const active = isNavigationItemActive(
            pathname,
            item,
          );

          return (
            <li key={item.href}>
              <NavigationItem
                item={item}
                active={active}
                collapsed={collapsed}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface NavigationItemProps {
  item: SidebarNavigationItem;
  active: boolean;
  collapsed: boolean;
}

function NavigationItem({
  item,
  active,
  collapsed,
}: NavigationItemProps) {
  const link = (
    <Link
      href={item.href}
      className={[
        styles.navigationItem,
        active ? styles.active : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      <span
        className={styles.iconFrame}
        aria-hidden="true"
      >
        {item.icon}
      </span>

      <span className={styles.itemContent}>
        <span className={styles.itemLabel}>
          {item.label}
        </span>

        {item.description && (
          <span className={styles.itemDescription}>
            {item.description}
          </span>
        )}
      </span>

      {item.badge && (
        <span className={styles.badge}>
          {item.badge}
        </span>
      )}

      {active && (
        <span
          className={styles.activeMarker}
          aria-hidden="true"
        />
      )}
    </Link>
  );

  return (
    <Tooltip
      content={item.label}
      placement="right"
      disabled={!collapsed}
    >
      {link}
    </Tooltip>
  );
}

function isNavigationItemActive(
  pathname: string,
  item: SidebarNavigationItem,
) {
  if (item.exact || item.href === '/') {
    return pathname === item.href;
  }

  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)
  );
}