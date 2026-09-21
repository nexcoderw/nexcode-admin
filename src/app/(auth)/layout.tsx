import type { ReactNode } from 'react';

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

        <header className={styles.brandHeader}>
          <div className={styles.brand}>
            <span
              className={styles.brandMark}
              aria-hidden="true"
            >
              N
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

          <div className={styles.environment}>
            <span
              className={styles.environmentDot}
              aria-hidden="true"
            />

            <span>Secure workspace</span>
          </div>
        </header>

        <div className={styles.brandBody}>
          <div className={styles.introduction}>
            <div className={styles.sectionIndex}>
              <span>01</span>

              <span
                className={styles.indexLine}
                aria-hidden="true"
              />
            </div>

            <div className={styles.copy}>
              <p className={styles.eyebrow}>
                NEXCODE control centre
              </p>

              <h1
                id="auth-brand-title"
                className={styles.heading}
              >
                One secure workspace.
                <span> Complete operational control.</span>
              </h1>

              <p className={styles.description}>
                Access the internal administration environment
                for managing platform operations, users,
                content, configuration, and activity.
              </p>
            </div>
          </div>

          <div
            className={styles.console}
            aria-hidden="true"
          >
            <div className={styles.consoleHeader}>
              <div className={styles.consoleControls}>
                <span />
                <span />
                <span />
              </div>

              <span className={styles.consolePath}>
                admin@nexcode:~
              </span>

              <span className={styles.consoleState}>
                online
              </span>
            </div>

            <div className={styles.consoleBody}>
              <div className={styles.command}>
                <span className={styles.prompt}>
                  $
                </span>

                <span>
                  initialise --workspace admin
                </span>
              </div>

              <div className={styles.consoleOutput}>
                <span className={styles.outputLabel}>
                  AUTH
                </span>

                <span>Administrator access required</span>
              </div>

              <div className={styles.consoleOutput}>
                <span className={styles.outputLabel}>
                  MODE
                </span>

                <span>Protected operational environment</span>
              </div>

              <div className={styles.consoleOutput}>
                <span className={styles.outputLabel}>
                  STATE
                </span>

                <span className={styles.ready}>
                  Ready for authentication
                </span>
              </div>

              <div className={styles.command}>
                <span className={styles.prompt}>
                  $
                </span>

                <span className={styles.cursor}>
                  _
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.brandFooter}>
          <div className={styles.systemInfo}>
            <div>
              <span className={styles.systemLabel}>
                System
              </span>

              <span className={styles.systemValue}>
                Admin Portal
              </span>
            </div>

            <div>
              <span className={styles.systemLabel}>
                Access
              </span>

              <span className={styles.systemValue}>
                Restricted
              </span>
            </div>

            <div>
              <span className={styles.systemLabel}>
                Status
              </span>

              <span className={styles.systemValue}>
                Operational
              </span>
            </div>
          </div>

          <span className={styles.version}>
            NEXCODE / ADMIN
          </span>
        </footer>
      </section>

      <section className={styles.authPanel}>
        <header className={styles.mobileHeader}>
          <div className={styles.brand}>
            <span
              className={styles.mobileBrandMark}
              aria-hidden="true"
            >
              N
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

          <span
            className={styles.mobileStatus}
            aria-label="System operational"
          >
            <span aria-hidden="true" />
            Online
          </span>
        </header>

        <div className={styles.authContent}>
          <div className={styles.authContainer}>
            <div
              className={styles.authAccent}
              aria-hidden="true"
            >
              <span>AUTH</span>
              <span>01</span>
            </div>

            <div className={styles.formContainer}>
              {children}
            </div>
          </div>
        </div>

        <footer className={styles.authFooter}>
          <span>
            © {new Date().getFullYear()} NEXCODE
          </span>

          <div className={styles.authFooterStatus}>
            <span
              className={styles.statusDot}
              aria-hidden="true"
            />

            <span>
              Protected administrator access
            </span>
          </div>
        </footer>
      </section>
    </main>
  );
}