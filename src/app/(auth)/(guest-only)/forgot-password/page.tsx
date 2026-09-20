import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/Button/Button';
import { Icon } from '@/components/ui/Icon/Icon';
import { Input } from '@/components/ui/Input/Input';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Forgot password',
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <Link
        href="/login"
        className={styles.backLink}
      >
        <Icon
          icon={ArrowLeft01Icon}
          size={16}
        />

        <span>Back to sign in</span>
      </Link>

      <header className={styles.header}>
        <span className={styles.sectionLabel}>
          Password recovery
        </span>

        <h2 className={styles.title}>
          Reset your password
        </h2>

        <p className={styles.description}>
          Enter the email address associated with your
          administrator account and we&apos;ll send you
          instructions to reset your password.
        </p>
      </header>

      <form
        className={styles.form}
        action="#"
      >
        <Input
          type="email"
          name="email"
          label="Email address"
          placeholder="Enter your email address"
          autoComplete="email"
          inputMode="email"
          leftIcon={
            <Icon
              icon={Mail01Icon}
              size={18}
            />
          }
          required
        />

        <div className={styles.submit}>
          <Button
            type="submit"
            size="lg"
            rightIcon={
              <Icon
                icon={ArrowRight01Icon}
                size={18}
              />
            }
          >
            Send instructions
          </Button>
        </div>
      </form>
    </div>
  );
}
