import { Login01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { UnauthorizedArt } from "@/components/errors/ErrorArt/UnauthorizedArt";
import { ErrorScreen } from "@/components/errors/ErrorScreen/ErrorScreen";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";

export const metadata: Metadata = {
  title: "Session ended",
};

/**
 * 401: a session existed and the backend no longer accepts it. Reached
 * by redirect, so the address can be shared or bookmarked as it is.
 */
export default function UnauthorizedPage() {
  return (
    <ErrorScreen
      status="401"
      title="Your session has ended"
      description="For your security, you were signed out after a period of inactivity or from another device. Sign in again to pick up where you left off."
      illustration={<UnauthorizedArt />}
      actions={
        <Button
          href={AUTH_ROUTES.login}
          size="lg"
          leftIcon={<Icon icon={Login01Icon} size={18} />}
        >
          Sign in again
        </Button>
      }
    />
  );
}
