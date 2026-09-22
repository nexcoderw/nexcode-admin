import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { getCurrentAdmin } from "@/utils/auth/current-admin";

interface GuestOnlyLayoutProps {
  children: ReactNode;
}

export default async function GuestOnlyLayout({
  children,
}: GuestOnlyLayoutProps) {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "authenticated") {
    redirect(ROUTES.admin.dashboard);
  }

  return children;
}
