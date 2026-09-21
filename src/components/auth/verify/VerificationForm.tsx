"use client";

import { useState } from "react";

import { Button } from "../../../components/ui/Button/Button";

import styles from "./VerificationForm.module.css";

const CODE_LENGTH = 6;

export function VerificationForm() {
  const [code, setCode] = useState("");

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH);

    setCode(value);
  };

  return (
    <form className={styles.form} action="#">
      <div className={styles.codeField}>
        <label htmlFor="verification-code" className={styles.label}>
          Verification code
        </label>

        <div className={styles.codeControl}>
          <input
            id="verification-code"
            className={styles.codeInput}
            type="text"
            name="code"
            value={code}
            onChange={handleCodeChange}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={CODE_LENGTH}
            aria-describedby="verification-code-hint"
            required
            autoFocus
          />

          <div className={styles.digits} aria-hidden="true">
            {Array.from({ length: CODE_LENGTH }, (_, index) => {
              const digit = code[index];
              const active = index === code.length && code.length < CODE_LENGTH;

              return (
                <span
                  key={index}
                  className={[
                    styles.digit,
                    digit ? styles.filled : "",
                    active ? styles.active : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {digit ?? ""}
                </span>
              );
            })}
          </div>
        </div>

        <p id="verification-code-hint" className={styles.hint}>
          Enter all 6 digits from your verification message.
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={code.length !== CODE_LENGTH}
      >
        Verify and continue
      </Button>

      <div className={styles.resend}>
        <p>Didn&apos;t receive a code?</p>

        <button
          type="button"
          className={styles.resendButton}
          disabled
          aria-describedby="resend-note"
        >
          Resend code
        </button>
      </div>

      <p id="resend-note" className={styles.resendNote}>
        Resending will become available when the verification service is
        connected.
      </p>
    </form>
  );
}
