import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password/ResetPasswordForm";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <Link href={ROUTES.auth.forgotPassword} className={styles.backLink}>
        <Icon icon={ArrowLeft01Icon} size={16} />

        <span>Request a new code</span>
      </Link>

      <header className={styles.header}>
        <span className={styles.sectionLabel}>Password reset</span>

        <h2 className={styles.title}>Create a new password</h2>

        <p className={styles.description}>
          Choose a secure password for your administrator account. After the
          password is changed, you&apos;ll sign in again with the new password.
        </p>
      </header>

      <ResetPasswordForm />
    </div>
  );
}
