import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { VerificationForm } from "@/components/auth/verify/VerificationForm";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Verify your identity",
};

export default function VerifyPage() {
  return (
    <div className={styles.page}>
      <Link href={ROUTES.auth.forgotPassword} className={styles.backLink}>
        <Icon icon={ArrowLeft01Icon} size={16} />

        <span>Request a new code</span>
      </Link>

      <header className={styles.header}>
        <span className={styles.sectionLabel}>Security verification</span>

        <h2 className={styles.title}>Enter your verification code</h2>

        <p className={styles.description}>
          Enter the 6-digit code sent to your registered email address to
          continue.
        </p>
      </header>

      <VerificationForm />
    </div>
  );
}
