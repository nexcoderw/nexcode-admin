import type { ReactNode } from "react";

import styles from "./ErrorScreen.module.css";

interface ErrorScreenProps {
  /**
   * Status number shown beside the drawing, such as "503".
   */
  status: string;

  /**
   * Short plain-English summary of what happened.
   */
  title: string;

  /**
   * What the reader should understand and do next.
   */
  description: string;

  /**
   * The drawing that belongs to this status. Each screen has its own
   * shape, because the shape is recognised before anything is read.
   */
  illustration: ReactNode;

  /**
   * Actions offered to the reader, such as retry or a way back.
   */
  actions: ReactNode;

  /**
   * Backend correlation reference, when the failure came from the
   * backend. It ties a report to the server log without exposing any
   * technical detail about the failure itself.
   */
  correlationId?: string | null;
}

export function ErrorScreen({
  status,
  title,
  description,
  illustration,
  actions,
  correlationId,
}: ErrorScreenProps) {
  return (
    <main className={styles.screen}>
      <div className={styles.panel}>
        <div className={styles.art} aria-hidden="true">
          {illustration}
        </div>

        <div className={styles.copy}>
          <span className={styles.status}>{status}</span>

          <h1 className={styles.title}>{title}</h1>

          <p className={styles.description}>{description}</p>

          <div className={styles.actions}>{actions}</div>

          {correlationId && (
            <p className={styles.reference}>
              <span>Reference</span>

              <code>{correlationId}</code>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
