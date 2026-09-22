"use client";

import {
  ArrowRight01Icon,
  LockPasswordIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { API_ROUTES, ROUTES } from "@/constants/routes";
import { MESSAGE_KEYS, MESSAGES } from "@/constants/shared/messages";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";

import styles from "./LoginForm.module.css";

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

interface LoginApiResponse {
  success?: boolean;
  messageKey?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");

    const rememberMe = formData.get("remember") === "on";

    const errors = validateFields(email, password);

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      focusFirstInvalidField(form, errors);

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ROUTES.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const payload = await readLoginResponse(response);

      if (!response.ok || payload?.success !== true) {
        setFormError(resolveFailureMessage(payload?.messageKey));

        return;
      }

      router.replace(ROUTES.admin.dashboard);

      router.refresh();
    } catch {
      setFormError(MESSAGES[MESSAGE_KEYS.common.serviceUnavailable]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <div className={styles.fields}>
        <Input
          type="email"
          name="email"
          label="Email address"
          placeholder="Enter your email address"
          autoComplete="email"
          inputMode="email"
          leftIcon={<Icon icon={Mail01Icon} size={18} />}
          error={fieldErrors.email}
          disabled={isSubmitting}
          required
        />

        <PasswordInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          leftIcon={<Icon icon={LockPasswordIcon} size={18} />}
          error={fieldErrors.password}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className={styles.options}>
        <Checkbox name="remember" label="Remember me" disabled={isSubmitting} />

        <Link
          href={ROUTES.auth.forgotPassword}
          className={styles.forgotPassword}
        >
          Forgot password?
        </Link>
      </div>

      <div className={styles.submit}>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingLabel="Signing in"
          rightIcon={<Icon icon={ArrowRight01Icon} size={18} />}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
}

function validateFields(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

function focusFirstInvalidField(
  form: HTMLFormElement,
  errors: LoginFieldErrors,
) {
  const fieldName =
    errors.email !== undefined
      ? "email"
      : errors.password !== undefined
        ? "password"
        : null;

  if (!fieldName) {
    return;
  }

  const field = form.elements.namedItem(fieldName);

  if (field instanceof HTMLElement) {
    field.focus();
  }
}

async function readLoginResponse(
  response: Response,
): Promise<LoginApiResponse | null> {
  try {
    return (await response.json()) as LoginApiResponse;
  } catch {
    return null;
  }
}

function resolveFailureMessage(messageKey: unknown) {
  if (typeof messageKey === "string" && messageKey in MESSAGES) {
    return MESSAGES[messageKey as keyof typeof MESSAGES];
  }

  return MESSAGES[MESSAGE_KEYS.common.serviceUnavailable];
}
