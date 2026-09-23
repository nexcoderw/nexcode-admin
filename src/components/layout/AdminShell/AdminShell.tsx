"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { AUTH_API_ROUTES, AUTH_ROUTES } from "@/constants/routes/auth-routes";

import type { HeaderAdmin } from "../Header/Header";
import { Header } from "../Header/Header";

import styles from "./AdminShell.module.css";

export interface AdminShellProps {
  children: ReactNode;
  admin: HeaderAdmin;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  headerActions?: ReactNode;
}

interface LogoutResponse {
  signedOut?: boolean;
}

export function AdminShell({
  children,
  admin,
  notificationCount = 0,
  onNotificationsClick,
  headerActions,
}: AdminShellProps) {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      const response = await fetch(AUTH_API_ROUTES.logout, {
        method: "POST",
      });

      const body = await readLogoutResponse(response);

      if (body?.signedOut !== true) {
        setIsSigningOut(false);
        return;
      }

      router.replace(AUTH_ROUTES.login);

      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <div className={styles.shell}>
      <Header
        admin={admin}
        notificationCount={notificationCount}
        onNotificationsClick={onNotificationsClick}
        onSignOut={handleSignOut}
        isSigningOut={isSigningOut}
        actions={headerActions}
      />

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}

async function readLogoutResponse(
  response: Response,
): Promise<LogoutResponse | null> {
  try {
    return (await response.json()) as LogoutResponse;
  } catch {
    return null;
  }
}
