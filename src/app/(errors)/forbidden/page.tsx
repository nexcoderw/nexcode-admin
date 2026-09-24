import { UserSwitchIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ForbiddenArt } from "@/components/errors/ErrorArt/ForbiddenArt";
import { ErrorScreen } from "@/components/errors/ErrorScreen/ErrorScreen";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";

export const metadata: Metadata = {
  title: "Access restricted",
};

/**
 * 403: the visitor is signed in, but this account is not an
 * administrator. Signing in again with the same account cannot change
 * that, so this page must never redirect to login on its own.
 */
export default function ForbiddenPage() {
  return (
    <ErrorScreen
      status="403"
      title="This area is restricted"
      description="You are signed in, but this account does not have access to the NEXCODE admin. If you should have access, ask an existing administrator to grant it, or sign in with a different account."
      illustration={<ForbiddenArt />}
      actions={
        <Button
          href={AUTH_ROUTES.login}
          variant="secondary"
          size="lg"
          leftIcon={<Icon icon={UserSwitchIcon} size={18} />}
        >
          Use a different account
        </Button>
      }
    />
  );
}
