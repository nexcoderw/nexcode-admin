import { DashboardBrowsingIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { NotFoundArt } from "@/components/errors/ErrorArt/NotFoundArt";
import { ErrorScreen } from "@/components/errors/ErrorScreen/ErrorScreen";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Shown for any address that matches no route, and wherever a page calls
 * notFound() — a portfolio that has been deleted, for instance.
 */
export default function NotFound() {
  return (
    <ErrorScreen
      status="404"
      title="There is nothing at this address"
      description="The page may have been moved or deleted, or the link may be mistyped. Everything you manage is still reachable from the dashboard."
      illustration={<NotFoundArt />}
      actions={
        <Button
          href={ADMIN_ROUTES.dashboard}
          size="lg"
          leftIcon={<Icon icon={DashboardBrowsingIcon} size={18} />}
        >
          Go to dashboard
        </Button>
      }
    />
  );
}
