import {
  ArrowRight01Icon,
  LockPasswordIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "../../../components/ui/Button/Button";
import { Checkbox } from "../../../components/ui/Checkbox/Checkbox";
import { Icon } from "../../../components/ui/Icon/Icon";
import { Input } from "../../../components/ui/Input/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput/PasswordInput";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the NEXCODE administration portal.",
};

export default function LoginPage() {
  return (
    <div className={styles.login}>
      <header className={styles.header}>
        <span className={styles.sectionLabel}>Administrator access</span>

        <h2 className={styles.title}>Welcome back</h2>

        <p className={styles.description}>
          Sign in with your administrator credentials to continue to the NEXCODE
          workspace.
        </p>
      </header>

      <form className={styles.form} action="#">
        <div className={styles.fields}>
          <Input
            type="email"
            name="email"
            label="Email address"
            placeholder="Enter your email address"
            autoComplete="email"
            inputMode="email"
            leftIcon={<Icon icon={Mail01Icon} size={18} />}
            required
          />

          <PasswordInput
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Icon icon={LockPasswordIcon} size={18} />}
            required
          />
        </div>

        <div className={styles.options}>
          <Checkbox name="remember" label="Remember me" />

          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>

        <div className={styles.submit}>
          <Button
            type="submit"
            size="lg"
            rightIcon={<Icon icon={ArrowRight01Icon} size={18} />}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
