import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { TeamEmptyState } from "@/components/team/TeamEmptyState/TeamEmptyState";
import { TeamFilters } from "@/components/team/TeamFilters/TeamFilters";
import { TeamGrid } from "@/components/team/TeamGrid/TeamGrid";
import { TeamPagination } from "@/components/team/TeamPagination/TeamPagination";
import { Alert } from "@/components/ui/Alert/Alert";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { listTeam } from "@/endpoints/team/list-team";
import { ADMIN_SESSION_COOKIE_NAME } from "@/utils/auth/session";
import {
  parseTeamListQuery,
  toTeamEndpointQuery,
} from "@/utils/team/team-list-query";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Team",
};

interface TeamPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const query = parseTeamListQuery(await searchParams);

  const cookieStore = await cookies();

  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    redirect(ROUTES.auth.login);
  }

  const incomingHeaders = await headers();

  const forwarded = new Headers();

  incomingHeaders.forEach((value, key) => {
    forwarded.set(key, value);
  });

  let result: Awaited<ReturnType<typeof listTeam>> | null = null;

  try {
    result = await listTeam(sessionId, forwarded, toTeamEndpointQuery(query));
  } catch {
    result = null;
  }

  if (result && (result.status === 401 || result.status === 403)) {
    redirect(ROUTES.auth.login);
  }

  const data = result?.ok ? result.data : null;

  const filtered = Boolean(query.search) || query.ordering !== "-created_at";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.sectionLabel}>Management</span>

          <h1 className={styles.title}>Team</h1>

          <p className={styles.description}>
            Manage NEXCODE team members, professional profiles and public
            profile imagery.
          </p>
        </div>

        <Link href={ROUTES.admin.teamAdd} className={styles.addAction}>
          <span>Add team member</span>

          <Icon icon={ArrowRight01Icon} size={17} />
        </Link>
      </header>

      <TeamFilters query={query} />

      {!data ? (
        <Alert variant="error" title={"Team unavailable"}>
          Team information could not be loaded. Try again shortly.
        </Alert>
      ) : data.items.length === 0 ? (
        <TeamEmptyState filtered={filtered} />
      ) : (
        <>
          <TeamGrid items={data.items} />

          {data.pagination.totalItems > data.pagination.pageSize && (
            <TeamPagination pagination={data.pagination} query={query} />
          )}
        </>
      )}
    </div>
  );
}
