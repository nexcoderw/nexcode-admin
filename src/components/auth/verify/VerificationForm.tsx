"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { API_ROUTES, ROUTES } from "@/constants/routes";
import { resolveAuthMessage } from "@/utils/auth/resolve-message";

import styles from "./VerificationForm.module.css";

const CODE_LENGTH = 6;

interface VerificationResponse {
  success?: boolean;
  messageKey?: unknown;
}

export function VerificationForm() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH);

    setCode(value);

    if (formError) {
      setFormError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || code.length !== CODE_LENGTH) {
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(API_ROUTES.auth.verifyPasswordReset, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      const payload = await readResponse(response);

      if (!response.ok || payload?.success !== true) {
        setFormError(resolveAuthMessage(payload?.messageKey));

        setCode("");

        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });

        return;
      }

      router.replace(ROUTES.auth.resetPassword);
    } catch {
      setFormError(resolveAuthMessage(null));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <div className={styles.codeField}>
        <label htmlFor="verification-code" className={styles.label}>
          Verification code
        </label>

        <div className={styles.codeControl}>
          <input
            ref={inputRef}
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
            aria-describedby={"verification-code-hint"}
            disabled={isSubmitting}
            required
            autoFocus
          />

          <div className={styles.digits} aria-hidden="true">
            {Array.from(
              {
                length: CODE_LENGTH,
              },
              (_, index) => {
                const digit = code[index];

                const active =
                  index === code.length && code.length < CODE_LENGTH;

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
              },
            )}
          </div>
        </div>

        <p id="verification-code-hint" className={styles.hint}>
          Enter all 6 digits from your verification email.
        </p>
      </div>

      <div className={styles.submit}>
        <Button
          type="submit"
          size="lg"
          disabled={code.length !== CODE_LENGTH}
          isLoading={isSubmitting}
          loadingLabel="Verifying code"
          rightIcon={<Icon icon={ArrowRight01Icon} size={18} />}
        >
          Verify
        </Button>
      </div>

      <div className={styles.resend}>
        <span>Didn&apos;t receive the code?</span>

        <Link href={ROUTES.auth.forgotPassword} className={styles.resendButton}>
          Request another code
        </Link>
      </div>
    </form>
  );
}

async function readResponse(
  response: Response,
): Promise<VerificationResponse | null> {
  try {
    return (await response.json()) as VerificationResponse;
  } catch {
    return null;
  }
}
