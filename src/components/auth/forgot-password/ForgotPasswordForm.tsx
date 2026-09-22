"use client";

import { ArrowRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { API_ROUTES, ROUTES } from "@/constants/routes";
import { resolveAuthMessage } from "@/utils/auth/resolve-message";

import styles from "./ForgotPasswordForm.module.css";

interface PasswordResetRequestResponse {
  success?: boolean;
  messageKey?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    setEmailError(null);
    setFormError(null);

    if (!email) {
      setEmailError("Enter your email address.");

      const emailField = form.elements.namedItem("email");

      if (emailField instanceof HTMLElement) {
        emailField.focus();
      }

      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setEmailError("Enter a valid email address.");

      const emailField = form.elements.namedItem("email");

      if (emailField instanceof HTMLElement) {
        emailField.focus();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ROUTES.auth.requestPasswordReset, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const payload = await readResponse(response);

      if (!response.ok || payload?.success !== true) {
        setFormError(resolveAuthMessage(payload?.messageKey));

        return;
      }

      router.push(ROUTES.auth.verify);
    } catch {
      setFormError(resolveAuthMessage(null));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <Input
        type="email"
        name="email"
        label="Email address"
        placeholder="Enter your email address"
        autoComplete="email"
        inputMode="email"
        leftIcon={<Icon icon={Mail01Icon} size={18} />}
        error={emailError ?? undefined}
        disabled={isSubmitting}
        required
      />

      <div className={styles.submit}>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingLabel="Sending code"
          rightIcon={<Icon icon={ArrowRight01Icon} size={18} />}
        >
          Send verification code
        </Button>
      </div>
    </form>
  );
}

async function readResponse(
  response: Response,
): Promise<PasswordResetRequestResponse | null> {
  try {
    return (await response.json()) as PasswordResetRequestResponse;
  } catch {
    return null;
  }
}
