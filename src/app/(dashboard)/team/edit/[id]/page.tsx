import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { TeamForm } from "@/components/team/TeamForm/TeamForm";
import { Alert } from "@/components/ui/Alert/Alert";
import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import { getTeamMember } from "@/endpoints/team/get-team-member";
import { ADMIN_SESSION_COOKIE_NAME } from "@/utils/auth/session";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Edit Team Member",
};

interface TeamEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamEditPage({ params }: TeamEditPageProps) {
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
          This team member could not be loaded for editing. Try again shortly.
        </Alert>
      </div>
    );
  }

  const teamMember = result.teamMember;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={ROUTES.admin.team} className={styles.back}>
          <Icon icon={ArrowLeft01Icon} size={17} />
          Back to Team
        </Link>

        <span className={styles.sectionLabel}>Team management</span>

        <h1 className={styles.title}>
          Edit {teamMember.name ?? "team member"}
        </h1>

        <p className={styles.description}>
          Update this team member&apos;s profile information, professional links
          and managed imagery.
        </p>
      </header>

      <TeamForm mode="edit" teamMember={teamMember} />
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
