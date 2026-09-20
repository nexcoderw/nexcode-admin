import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/LoginForm/LoginForm";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign in",
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

      <LoginForm />
    </div>
  );
}
