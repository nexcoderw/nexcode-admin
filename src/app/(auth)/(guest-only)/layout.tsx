import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { getCurrentAdmin } from "@/utils/auth/current-admin";

interface GuestOnlyLayoutProps {
  children: ReactNode;
}

export default async function GuestOnlyLayout({
  children,
}: GuestOnlyLayoutProps) {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "authenticated") {
    redirect(ADMIN_ROUTES.dashboard);
  }

  return children;
}
