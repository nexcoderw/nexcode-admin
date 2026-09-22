import {
  ArrowRight01Icon,
  Briefcase01Icon,
  File01Icon,
  Mail01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import {
  redirect,
} from "next/navigation";

import { AdminShell } from "@/components/layout/AdminShell/AdminShell";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import {
  getCurrentAdmin,
} from "@/utils/auth/current-admin";

import styles from "./page.module.css";

// existing constants...

export default async function DashboardPage() {
  const currentAdmin =
    await getCurrentAdmin();

  if (
    currentAdmin.status ===
    "unauthenticated"
  ) {
    redirect(ROUTES.auth.login);
  }

  if (
    currentAdmin.status ===
    "unavailable"
  ) {
    throw new Error(
      "Unable to restore administrator session.",
    );
  }

  const admin = currentAdmin.admin;

  return (
    <AdminShell
      admin={{
        name: admin.fullName,
        email: admin.email,
      }}
    >
      Dashboard here
    </AdminShell>
  );
}