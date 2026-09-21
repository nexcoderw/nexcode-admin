import {
  ArrowLeft01Icon,
  LockPasswordIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "../../../components/ui/Button/Button";
import { Icon } from "../../../components/ui/Icon/Icon";
import { PasswordInput } from "../../../components/ui/PasswordInput/PasswordInput";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Create a new password for your NEXCODE administrator account.",
};

const passwordRequirements = [
  "At least 8 characters",
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
];

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <Link href="/login" className={styles.backLink}>
        <Icon icon={ArrowLeft01Icon} />

        <span>Back to sign in</span>
      </Link>

      <header className={styles.header}>
        <div className={styles.iconContainer} aria-hidden="true">
          <Icon icon={LockPasswordIcon} size={24} />
        </div>

        <div className={styles.heading}>
          <p className={styles.eyebrow}>Account security</p>

          <h2 className={styles.title}>Create a new password</h2>

          <p className={styles.description}>
            Choose a strong password that you have not previously used for your
            NEXCODE administrator account.
          </p>
        </div>
      </header>

      <form className={styles.form} action="#">
        <div className={styles.fields}>
          <PasswordInput
            name="password"
            label="New password"
            placeholder="Enter your new password"
            autoComplete="new-password"
            required
          />

          <PasswordInput
            name="passwordConfirmation"
            label="Confirm new password"
            placeholder="Enter your password again"
            autoComplete="new-password"
            required
          />
        </div>

        <PasswordRequirements />

        <Button type="submit" size="lg" fullWidth>
          Reset password
        </Button>
      </form>
    </div>
  );
}

function PasswordRequirements() {
  return (
    <section
      className={styles.requirements}
      aria-labelledby="password-requirements"
    >
      <h3 id="password-requirements" className={styles.requirementsTitle}>
        Password requirements
      </h3>

      <ul className={styles.requirementsList}>
        {passwordRequirements.map((requirement) => (
          <li key={requirement} className={styles.requirement}>
            <span className={styles.requirementIcon} aria-hidden="true">
              <Icon icon={Tick02Icon} size={14} />
            </span>

            <span>{requirement}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
