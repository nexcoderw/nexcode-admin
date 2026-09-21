import type { ReactNode } from "react";

import styles from "./layout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={styles.layout}>
      {" "}
      <section className={styles.brandPanel} aria-labelledby="auth-brand-title">
        {" "}
        <div className={styles.brandContent}>
          {" "}
          <div className={styles.brand}>
            {" "}
            <span className={styles.brandMark} aria-hidden="true">
              N{" "}
            </span>
            <div className={styles.brandIdentity}>
              <span className={styles.brandName}>NEXCODE</span>

              <span className={styles.brandProduct}>Administration</span>
            </div>
          </div>
          <div className={styles.message}>
            <p className={styles.eyebrow}>Administration portal</p>

            <h1 id="auth-brand-title" className={styles.heading}>
              Control your platform from one secure workspace.
            </h1>

            <p className={styles.description}>
              Manage NEXCODE operations, users, content, activity, and platform
              configuration through the administrative workspace.
            </p>
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.codeWindow}>
            <div className={styles.windowHeader}>
              <span />
              <span />
              <span />

              <span className={styles.windowLabel}>nexcode.admin</span>
            </div>

            <div className={styles.code}>
              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>01</span>

                <span>
                  <strong>const</strong> workspace = {"{"}
                </span>
              </div>

              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>02</span>

                <span className={styles.indent}>
                  secure: <em>true</em>,
                </span>
              </div>

              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>03</span>

                <span className={styles.indent}>
                  access: <em>&apos;admin&apos;</em>,
                </span>
              </div>

              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>04</span>

                <span className={styles.indent}>
                  status: <em>&apos;ready&apos;</em>
                </span>
              </div>

              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>05</span>

                <span>{"};"}</span>
              </div>

              <div className={styles.codeLine}>
                <span className={styles.lineNumber}>06</span>

                <span className={styles.cursor}>_</span>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.brandFooter}>NEXCODE administrative access</p>
      </section>
      <section className={styles.formPanel}>
        <div className={styles.mobileBrand}>
          <span className={styles.mobileBrandMark} aria-hidden="true">
            N
          </span>

          <div>
            <span className={styles.mobileBrandName}>NEXCODE</span>

            <span className={styles.mobileBrandProduct}>Admin</span>
          </div>
        </div>

        <div className={styles.formContainer}>{children}</div>

        <footer className={styles.formFooter}>
          <span>© {new Date().getFullYear()} NEXCODE</span>

          <span
            className={styles.secureAccess}
            aria-label="Secure administration access"
          >
            <span className={styles.statusDot} aria-hidden="true" />
            Secure access
          </span>
        </footer>
      </section>
    </main>
  );
}
