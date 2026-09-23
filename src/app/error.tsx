"use client";

import { ApplicationErrorArt } from "@/components/errors/ErrorArt/ApplicationErrorArt";
import { ErrorScreen } from "@/components/errors/ErrorScreen/ErrorScreen";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { DashboardBrowsingIcon } from "@hugeicons/core-free-icons";
import ReloadIcon from "@hugeicons/core-free-icons/ReloadIcon";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Catches anything a route or nested layout throws. The reader is shown
 * the portal's own wording and the digest only — never `error.message`,
 * which may carry internal detail from an exception that was never
 * meant for them.
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <ErrorScreen
      status="500"
      title="Something went wrong on our side"
      description="The portal could not finish loading this screen. Your session is still active and nothing you were working on has been lost. Try again, and if it keeps happening, share the reference below with your platform administrator."
      illustration={<ApplicationErrorArt />}
      correlationId={error.digest ?? null}
      actions={
        <>
          <Button
            size="lg"
            onClick={reset}
            leftIcon={<Icon icon={ReloadIcon} size={18} />}
          >
            Try again
          </Button>

          <Button
            href={ROUTES.admin.dashboard}
            variant="secondary"
            size="lg"
            leftIcon={<Icon icon={DashboardBrowsingIcon} size={18} />}
          >
            Go to dashboard
          </Button>
        </>
      }
    />
  );
}
