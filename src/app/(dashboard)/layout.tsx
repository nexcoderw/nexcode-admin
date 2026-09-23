import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/layout/AdminShell/AdminShell";
import { ROUTES } from "@/constants/routes";
import { getCurrentAdmin } from "@/utils/auth/current-admin";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "unauthenticated") {
    redirect(ROUTES.auth.login);
  }

  // The portal is up and the service behind it is not, which is a 503
  // the reader can act on — not a crash.
  if (currentAdmin.status === "unavailable") {
    redirect(ROUTES.errors.serviceUnavailable);
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
