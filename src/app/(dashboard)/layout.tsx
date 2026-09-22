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

  if (currentAdmin.status === "unavailable") {
    throw new Error("Administrator session validation is unavailable.");
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
