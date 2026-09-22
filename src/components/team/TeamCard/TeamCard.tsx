import {
  Edit02Icon,
  GithubIcon,
  Linkedin01Icon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";
import type { TeamMember } from "@/types/team/team";
import { getTeamImageSource } from "@/utils/team/team-image-source";

import styles from "./TeamCard.module.css";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const name = member.name ?? "Unnamed member";
  const image = getTeamImageSource(member.imagePng);
  const hasProfiles = Boolean(member.linkedin || member.github);

  return (
    <article className={styles.card}>
      <div className={styles.main}>
        <div className={styles.portrait}>
          {image ? (
            <Image
              src={image}
              alt={`${name} transparent profile portrait`}
              fill
              sizes="(max-width: 52rem) 100vw, (max-width: 78rem) 50vw, 33vw"
              className={styles.image}
              unoptimized={image.startsWith("/api/team/media")}
            />
          ) : (
            <div className={styles.fallback}>
              <Icon icon={UserIcon} size={32} />

              <span>Transparent portrait unavailable</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.identity}>
              <span className={styles.eyebrow}>Team member</span>

              <h2 className={styles.name}>
                <Link href={ROUTES.admin.teamDetail(member.id)}>{name}</Link>
              </h2>
            </div>

            <div className={styles.actions}>
              <Link
                href={ROUTES.admin.teamDetail(member.id)}
                className={styles.action}
                aria-label={`View ${name}`}
                title={`View ${name}`}
              >
                <Icon icon={ViewIcon} size={18} />
              </Link>

              <Link
                href={ROUTES.admin.teamEdit(member.id)}
                className={styles.action}
                aria-label={`Edit ${name}`}
                title={`Edit ${name}`}
              >
                <Icon icon={Edit02Icon} size={18} />
              </Link>
            </div>
          </header>

          <dl className={styles.details}>
            {member.position && (
              <div className={styles.detailRow}>
                <dt>Role</dt>
                <dd>{member.position}</dd>
              </div>
            )}

            {hasProfiles && (
              <div className={styles.detailRow}>
                <dt>Profiles</dt>

                <dd className={styles.profiles}>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.profileLink}
                      aria-label={`${name} on LinkedIn`}
                      title="Open LinkedIn profile"
                    >
                      <Icon icon={Linkedin01Icon} size={17} />
                    </a>
                  )}

                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.profileLink}
                      aria-label={`${name} on GitHub`}
                      title="Open GitHub profile"
                    >
                      <Icon icon={GithubIcon} size={17} />
                    </a>
                  )}
                </dd>
              </div>
            )}

            <div className={styles.detailRow}>
              <dt>Joined</dt>
              <dd>{formatDate(member.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.slug}>@{member.slug}</span>

        <span>Updated {formatDate(member.updatedAt)}</span>
      </footer>
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
