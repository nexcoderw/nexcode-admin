import type { ReactNode } from 'react';
import Image from 'next/image';

import styles from './layout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className={styles.layout}>
      <section
        className={styles.brandPanel}
        aria-labelledby="auth-brand-title"
      >
        <div
          className={styles.grid}
          aria-hidden="true"
        />

        <div className={styles.brandContent}>
          <div className={styles.brand}>
            <span
              className={styles.brandMark}
              aria-hidden="true"
            >
              <Image src="/nexcode-icon.svg" alt="" width={40} height={40} />
            </span>

            <div className={styles.brandIdentity}>
              <span className={styles.brandName}>
                NEXCODE
              </span>

              <span className={styles.brandProduct}>
                Administration
              </span>
            </div>
          </div>

          <div className={styles.introduction}>
            <span className={styles.sectionLabel}>
              Administration portal
            </span>

            <h1
              id="auth-brand-title"
              className={styles.heading}
            >
              Manage your platform with clarity and control.
            </h1>

            <p className={styles.description}>
              Secure access to the NEXCODE administrative
              workspace for managing users, content,
              configuration, and platform operations.
            </p>
          </div>

          <div
            className={styles.brandDetail}
            aria-hidden="true"
          >
            <span className={styles.detailLine} />

            <span className={styles.detailText}>
              NEXCODE ADMIN
            </span>
          </div>
        </div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.mobileBrand}>
          <span
            className={styles.mobileBrandMark}
            aria-hidden="true"
          >
            <Image src="/nexcode-icon.svg" alt="" width={40} height={40} />
          </span>

          <div className={styles.brandIdentity}>
            <span className={styles.brandName}>
              NEXCODE
            </span>

            <span className={styles.brandProduct}>
              Administration
            </span>
          </div>
        </div>

        <div className={styles.authContent}>
          <div className={styles.formContainer}>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
