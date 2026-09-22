import { ArrowLeft01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { TeamDeleteAction } from "@/components/team/TeamDeleteAction/TeamDeleteAction";
import { TeamDetails } from "@/components/team/TeamDetails/TeamDetails";
import { Alert } from "@/components/ui/Alert/Alert";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { getTeamMember } from "@/endpoints/team/get-team-member";
import { ADMIN_SESSION_COOKIE_NAME } from "@/utils/auth/session";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Team Member",
};

interface TeamDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const teamId = parseTeamId((await params).id);

  if (!teamId) {
    notFound();
  }

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

  let result: Awaited<ReturnType<typeof getTeamMember>> | null = null;

  try {
    result = await getTeamMember(teamId, sessionId, forwarded);
  } catch {
    result = null;
  }

  if (result && (result.status === 401 || result.status === 403)) {
    redirect(ROUTES.auth.login);
  }

  if (result?.status === 404) {
    notFound();
  }

  if (!result?.ok || !result.teamMember) {
    return (
      <div className={styles.page}>
        <Link href={ROUTES.admin.team} className={styles.back}>
          <Icon icon={ArrowLeft01Icon} size={17} />
          Back to Team
        </Link>

        <Alert variant="error" title="Team member unavailable">
          This team member could not be loaded. The Team service may be
          temporarily unavailable.
        </Alert>
      </div>
    );
  }

  const teamMember = result.teamMember;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link href={ROUTES.admin.team} className={styles.back}>
            <Icon icon={ArrowLeft01Icon} size={17} />
            Back to Team
          </Link>

          <span className={styles.sectionLabel}>Team management</span>

          <h1 className={styles.title}>{teamMember.name ?? "Team member"}</h1>

          <p className={styles.description}>
            Review this team member&apos;s profile, media and professional
            information.
          </p>
        </div>

        <Link
          href={ROUTES.admin.teamEdit(teamMember.id)}
          className={styles.editAction}
        >
          <Icon icon={Edit02Icon} size={17} />
          Edit
        </Link>
      </header>

      <TeamDetails teamMember={teamMember} />

      <section className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <div>
            <h2 className={styles.dangerTitle}>Delete team member</h2>

            <p className={styles.dangerDescription}>
              Permanently remove this member and their managed Team media.
            </p>
          </div>

          <TeamDeleteAction teamId={teamMember.id} teamName={teamMember.name} />
        </div>
      </section>
    </div>
  );
}

function parseTeamId(value: string) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
