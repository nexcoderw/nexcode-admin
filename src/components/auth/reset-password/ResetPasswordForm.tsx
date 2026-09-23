"use client";

import {
  ArrowRight01Icon,
  LockPasswordIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { AUTH_API_ROUTES, AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { resolveAuthMessage } from "@/utils/auth/resolve-message";

import styles from "./ResetPasswordForm.module.css";

interface ResetPasswordResponse {
  success?: boolean;
  messageKey?: unknown;
}

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

const passwordRequirements = [
  "At least 8 characters",
  "Not entirely numeric",
  "Not a commonly used password",
  "Not too similar to your account information",
];

export function ResetPasswordForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const password = String(formData.get("password") ?? "");

    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const errors = validatePasswords(password, confirmPassword);

    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      focusFirstInvalidField(form, errors);

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(AUTH_API_ROUTES.confirmPasswordReset, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      const payload = await readResponse(response);

      if (!response.ok || payload?.success !== true) {
        setFormError(resolveAuthMessage(payload?.messageKey));

        return;
      }

      router.replace(AUTH_ROUTES.login);

      router.refresh();
    } catch {
      setFormError(resolveAuthMessage(null));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <div className={styles.fields}>
        <PasswordInput
          name="password"
          label="New password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          leftIcon={<Icon icon={LockPasswordIcon} size={18} />}
          error={fieldErrors.password}
          disabled={isSubmitting}
          required
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm password"
          placeholder="Enter your password again"
          autoComplete="new-password"
          leftIcon={<Icon icon={LockPasswordIcon} size={18} />}
          error={fieldErrors.confirmPassword}
          disabled={isSubmitting}
          required
        />
      </div>

      <PasswordRequirements />

      <div className={styles.submit}>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingLabel="Resetting password"
          rightIcon={<Icon icon={ArrowRight01Icon} size={18} />}
        >
          Reset password
        </Button>
      </div>
    </form>
  );
}

function PasswordRequirements() {
  return (
    <section
      className={styles.requirements}
      aria-labelledby="password-requirements"
    >
      <h3 id="password-requirements" className={styles.requirementsTitle}>
        Your password should
      </h3>

      <ul className={styles.requirementsList}>
        {passwordRequirements.map((requirement) => (
          <li key={requirement} className={styles.requirement}>
            <Icon icon={Tick02Icon} size={14} />

            <span>{requirement}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function validatePasswords(
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!password) {
    errors.password = "Enter your new password.";
  } else if (password.length < 8) {
    errors.password = "Password must contain at least 8 characters.";
  } else if (/^\d+$/.test(password)) {
    errors.password = "Password cannot be entirely numeric.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your new password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function focusFirstInvalidField(form: HTMLFormElement, errors: FieldErrors) {
  const fieldName = errors.password
    ? "password"
    : errors.confirmPassword
      ? "confirmPassword"
      : null;

  if (!fieldName) {
    return;
  }

  const field = form.elements.namedItem(fieldName);

  if (field instanceof HTMLElement) {
    field.focus();
  }
}

async function readResponse(
  response: Response,
): Promise<ResetPasswordResponse | null> {
  try {
    return (await response.json()) as ResetPasswordResponse;
  } catch {
    return null;
  }
}
