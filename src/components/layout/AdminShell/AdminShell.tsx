'use client';

import type { ReactNode } from 'react';

import type {
  HeaderAdmin,
} from '../Header/Header';
import { Header } from '../Header/Header';

import styles from './AdminShell.module.css';

export interface AdminShellProps {
  children: ReactNode;
  admin: HeaderAdmin;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onSignOut?: () => void;
  headerActions?: ReactNode;
}

export function AdminShell({
  children,
  admin,
  notificationCount = 0,
  onNotificationsClick,
  onSignOut,
  headerActions,
}: AdminShellProps) {
  return (
    <div className={styles.shell}>
      <Header
        admin={admin}
        notificationCount={notificationCount}
        onNotificationsClick={onNotificationsClick}
        onSignOut={onSignOut}
        actions={headerActions}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}