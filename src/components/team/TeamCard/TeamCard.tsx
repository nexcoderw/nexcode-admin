import {
  GithubIcon,
  Linkedin01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import type { TeamMember } from "@/types/team/team";
import { getTeamImageSource } from "@/utils/team/team-image-source";

import { TeamDetailsDialog } from "../TeamDetailsDialog/TeamDetailsDialog";
import { TeamDeleteAction } from "../TeamDeleteAction/TeamDeleteAction";
import { TeamFormDialogTrigger } from "../TeamFormDialog/TeamFormDialog";

import styles from "./TeamCard.module.css";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const name = member.name ?? "Unnamed member";

  // The Team card uses the standard profile image,
  // not the transparent PNG cutout.
  const image = getTeamImageSource(member.image);

  const hasProfiles = Boolean(member.linkedin || member.github);

  return (
    <article className={styles.card}>
      <div className={styles.main}>
        <div className={styles.portrait}>
          {image ? (
            <Image
              src={image}
              alt={`${name} profile portrait`}
              fill
              sizes="(max-width: 52rem) 100vw, (max-width: 78rem) 50vw, 33vw"
              className={styles.image}
              unoptimized={image.startsWith("/api/team/media")}
            />
          ) : (
            <div className={styles.fallback}>
              <Icon icon={UserIcon} size={32} />

              <span>Profile image unavailable</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.identity}>
              <span className={styles.eyebrow}>
                Team member · No. {member.displayOrder}
              </span>

              <h2 className={styles.name}>{name}</h2>
            </div>

            <div className={styles.actions}>
              <TeamDetailsDialog member={member} />

              <TeamFormDialogTrigger mode="edit" teamMember={member} compact />

              <TeamDeleteAction
                teamId={member.id}
                teamName={member.name}
                compact
              />
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
                    <Button
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="ghost"
                      size="sm"
                      iconOnly
                      leftIcon={<Icon icon={Linkedin01Icon} size={17} />}
                      aria-label={`${name} on LinkedIn`}
                      title="Open LinkedIn profile"
                    >
                      Open {name} on LinkedIn
                    </Button>
                  )}

                  {member.github && (
                    <Button
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="ghost"
                      size="sm"
                      iconOnly
                      leftIcon={<Icon icon={GithubIcon} size={17} />}
                      aria-label={`${name} on GitHub`}
                      title="Open GitHub profile"
                    >
                      Open {name} on GitHub
                    </Button>
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
