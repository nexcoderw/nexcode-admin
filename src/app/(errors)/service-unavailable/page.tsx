import type { Metadata } from "next";

import { ServiceUnavailableArt } from "@/components/errors/ErrorArt/ServiceUnavailableArt";
import { ErrorScreen } from "@/components/errors/ErrorScreen/ErrorScreen";
import { Button } from "@/components/ui/Button/Button";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { Icon } from "@/components/ui/Icon/Icon";
import { Login01Icon, ReloadIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Service unavailable",
};

interface ServiceUnavailablePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ServiceUnavailablePage({
  searchParams,
}: ServiceUnavailablePageProps) {
  const params = await searchParams;

  const reference = firstValue(params.ref);

  return (
    <ErrorScreen
      status="503"
      title="The service behind the portal is not responding"
      description="The administration portal is running, but it cannot reach the NEXCODE service right now. Nothing you were working on has been lost. Try again in a moment, and contact your platform administrator if this continues."
      illustration={<ServiceUnavailableArt />}
      correlationId={reference}
      actions={
        <>
          <Button
            href={ADMIN_ROUTES.dashboard}
            size="lg"
            leftIcon={<Icon icon={ReloadIcon} size={18} />}
          >
            Try again
          </Button>

          <Button
            href={AUTH_ROUTES.login}
            variant="secondary"
            size="lg"
            leftIcon={<Icon icon={Login01Icon} size={18} />}
          >
            Back to sign in
          </Button>
        </>
      }
    />
  );
}

/**
 * The reference is a correlation id only: a short opaque token that ties
 * a report to the server log. Anything longer or oddly shaped is ignored
 * rather than reflected back into the page.
 */
function firstValue(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !/^[A-Za-z0-9-]{1,64}$/.test(candidate)) {
    return null;
  }

  return candidate;
}
