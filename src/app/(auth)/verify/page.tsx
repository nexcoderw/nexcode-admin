import { ArrowLeft01Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "../../../components/ui/Icon/Icon";

import styles from "./page.module.css";
import { VerificationForm } from "@/components/auth/verify/VerificationForm";

export const metadata: Metadata = {
  title: "Verify your identity",
  description:
    "Verify your identity to continue to the NEXCODE administration portal.",
};

export default function VerifyPage() {
  return (
    <div className={styles.page}>
      <Link href="/login" className={styles.backLink}>
        <Icon icon={ArrowLeft01Icon} />

        <span>Back to sign in</span>
      </Link>

      <header className={styles.header}>
        <div className={styles.iconContainer} aria-hidden="true">
          <Icon icon={SecurityCheckIcon} size={24} />
        </div>

        <div className={styles.heading}>
          <p className={styles.eyebrow}>Security verification</p>

          <h2 className={styles.title}>Verify your identity</h2>

          <p className={styles.description}>
            Enter the 6-digit verification code sent to your registered email
            address.
          </p>
        </div>
      </header>

      <VerificationForm />
    </div>
  );
}
