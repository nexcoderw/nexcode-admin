import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/layout/AdminShell/AdminShell";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { ERROR_ROUTES } from "@/constants/routes/error-routes";
import { getCurrentAdmin } from "@/utils/auth/current-admin";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "unauthenticated") {
    redirect(AUTH_ROUTES.login);
  }

  // An ended session gets an explanation, not a silent jump to login.
  if (currentAdmin.status === "expired") {
    redirect(ERROR_ROUTES.unauthorized);
  }

  // Signed in but not an administrator: the login form cannot fix that,
  // so it must never be where this lands.
  if (currentAdmin.status === "forbidden") {
    redirect(ERROR_ROUTES.forbidden);
  }

  // The portal is up and the service behind it is not, which is a 503
  // the reader can act on — not a crash.
  if (currentAdmin.status === "unavailable") {
    redirect(ERROR_ROUTES.serviceUnavailable);
  }

  const admin = currentAdmin.admin;

  return (
    <AdminShell
      admin={{
        name: admin.fullName,
        email: admin.email,
      }}
    >
      {children}
    </AdminShell>
  );
}
