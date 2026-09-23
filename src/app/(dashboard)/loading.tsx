import { PageLoader } from "@/components/ui/PageLoader/PageLoader";

/**
 * The one loading state for every dashboard page. Next.js shows it while
 * any page under this segment resolves its data, inside the admin shell,
 * so the header stays in place and only the content area waits.
 */
export default function DashboardLoading() {
  return <PageLoader />;
}
