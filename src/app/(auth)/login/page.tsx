import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "../../../components/ui/Button/Button";
import { Checkbox } from "../../../components/ui/Checkbox/Checkbox";
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
      {" "}
      <header className={styles.header}>
        {" "}
        <p className={styles.eyebrow}>Welcome back </p>
        <h2 className={styles.title}>Sign in to NEXCODE</h2>
        <p className={styles.description}>
          Enter your administrator credentials to continue to the management
          workspace.
        </p>
      </header>
      <form className={styles.form} action="#">
        <div className={styles.fields}>
          <Input
            type="email"
            name="email"
            label="Email address"
            placeholder="admin@example.com"
            autoComplete="email"
            inputMode="email"
            required
          />

          <PasswordInput
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className={styles.options}>
          <Checkbox name="remember" label="Remember me" />

          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth>
          Sign in
        </Button>
      </form>
      <div className={styles.security}>
        <span className={styles.securityLine} aria-hidden="true" />

        <p>Access is restricted to authorised NEXCODE administrators.</p>

        <span className={styles.securityLine} aria-hidden="true" />
      </div>
    </div>
  );
}
