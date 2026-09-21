import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  LockPasswordIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '../../../components/ui/Button/Button';
import { Icon } from '../../../components/ui/Icon/Icon';
import { PasswordInput } from '../../../components/ui/PasswordInput/PasswordInput';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Reset password',
  description:
    'Create a new password for your NEXCODE administrator account.',
};

const passwordRequirements = [
  'At least 8 characters',
  'One uppercase letter',
  'One lowercase letter',
  'One number',
];

export default function ResetPasswordPage() {
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
          Password reset
        </span>

        <h2 className={styles.title}>
          Create a new password
        </h2>

        <p className={styles.description}>
          Choose a secure password for your administrator
          account. Make sure it is different from passwords
          you have used previously.
        </p>
      </header>

      <form
        className={styles.form}
        action="#"
      >
        <div className={styles.fields}>
          <PasswordInput
            name="password"
            label="New password"
            placeholder="Enter your new password"
            autoComplete="new-password"
            leftIcon={
              <Icon
                icon={LockPasswordIcon}
                size={18}
              />
            }
            required
          />

          <PasswordInput
            name="passwordConfirmation"
            label="Confirm password"
            placeholder="Enter your password again"
            autoComplete="new-password"
            leftIcon={
              <Icon
                icon={LockPasswordIcon}
                size={18}
              />
            }
            required
          />
        </div>

        <PasswordRequirements />

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
            Reset password
          </Button>
        </div>
      </form>
    </div>
  );
}

function PasswordRequirements() {
  return (
    <section
      className={styles.requirements}
      aria-labelledby="password-requirements"
    >
      <h3
        id="password-requirements"
        className={styles.requirementsTitle}
      >
        Your password should include
      </h3>

      <ul className={styles.requirementsList}>
        {passwordRequirements.map((requirement) => (
          <li
            key={requirement}
            className={styles.requirement}
          >
            <Icon
              icon={Tick02Icon}
              size={14}
            />

            <span>{requirement}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}