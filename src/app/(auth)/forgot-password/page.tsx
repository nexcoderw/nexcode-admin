import { ArrowLeft01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "../../../components/ui/Button/Button";
import { Icon } from "../../../components/ui/Icon/Icon";
import { Input } from "../../../components/ui/Input/Input";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Forgot password",
  description:
    "Request a password reset for your NEXCODE administrator account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      {" "}
      <Link href="/login" className={styles.backLink}>
        {" "}
        <Icon icon={ArrowLeft01Icon} />
        <span>Back to sign in</span>
      </Link>
      <header className={styles.header}>
        <div className={styles.iconContainer} aria-hidden="true">
          <Icon icon={Mail01Icon} size={24} />
        </div>

        <div className={styles.heading}>
          <p className={styles.eyebrow}>Account recovery</p>

          <h2 className={styles.title}>Forgot your password?</h2>

          <p className={styles.description}>
            Enter the email address associated with your administrator account.
            If an eligible account exists, password reset instructions will be
            sent to that address.
          </p>
        </div>
      </header>
      <form className={styles.form} action="#">
        <Input
          type="email"
          name="email"
          label="Email address"
          placeholder="admin@example.com"
          autoComplete="email"
          inputMode="email"
          leftIcon={<Icon icon={Mail01Icon} />}
          required
        />

        <Button type="submit" size="lg" fullWidth>
          Send reset instructions
        </Button>
      </form>
      <div className={styles.notice}>
        <span className={styles.noticeMark} aria-hidden="true">
          i
        </span>

        <p>
          For security, password recovery does not confirm whether an email
          address is registered.
        </p>
      </div>
    </div>
  );
}
