import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password/ForgotPasswordForm";
import { Icon } from "@/components/ui/Icon/Icon";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <Link href={AUTH_ROUTES.login} className={styles.backLink}>
        <Icon icon={ArrowLeft01Icon} size={16} />

        <span>Back to sign in</span>
      </Link>

      <header className={styles.header}>
        <span className={styles.sectionLabel}>Password recovery</span>

        <h2 className={styles.title}>Reset your password</h2>

        <p className={styles.description}>
          Enter the email address associated with your administrator account. If
          the account is eligible, we&apos;ll send a 6-digit verification code.
        </p>
      </header>

      <ForgotPasswordForm />
    </div>
  );
}
