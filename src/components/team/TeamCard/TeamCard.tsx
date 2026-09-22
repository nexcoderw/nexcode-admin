import {
  Edit02Icon,
  GithubIcon,
  Linkedin01Icon,
  UserIcon,
  ViewIcon,
  WorkIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge/Badge";
import { Icon } from "@/components/ui/Icon/Icon";
import { Tooltip } from "@/components/ui/Tooltip/Tooltip";
import { ROUTES } from "@/constants/routes";
import type { TeamMember } from "@/types/team/team";
import { getTeamImageSource } from "@/utils/team/team-image-source";

import { TeamCardMotion } from "../TeamCardMotion/TeamCardMotion";

import styles from "./TeamCard.module.css";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const name = member.name ?? "Unnamed member";
  const image = getTeamImageSource(member.imagePng);
  const hasDetails = Boolean(
    member.position || member.linkedin || member.github,
  );

  return (
    <article className={styles.card}>
      <TeamCardMotion />

      <div className={styles.actions}>
        <Tooltip content={`View ${name}`} placement="bottom">
          <Link
            href={ROUTES.admin.teamDetail(member.id)}
            className={styles.action}
            aria-label={`View ${name}`}
          >
            <Icon icon={ViewIcon} size={18} />
          </Link>
        </Tooltip>

        <Tooltip content={`Edit ${name}`} placement="bottom">
          <Link
            href={ROUTES.admin.teamEdit(member.id)}
            className={styles.action}
            aria-label={`Edit ${name}`}
          >
            <Icon icon={Edit02Icon} size={18} />
          </Link>
        </Tooltip>
      </div>

      <div className={styles.portrait}>
        {image ? (
          <Image
            src={image}
            alt={`${name} transparent profile portrait`}
            fill
            sizes="(max-width: 36rem) 100vw, (max-width: 58rem) 50vw, (max-width: 78rem) 33vw, 25vw"
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

      <div
        className={[styles.content, hasDetails ? "" : styles.contentStatic]
          .filter(Boolean)
          .join(" ")}
      >
        <h2 className={styles.name}>
          <Link href={ROUTES.admin.teamDetail(member.id)}>{name}</Link>
        </h2>

        {hasDetails && (
          <div className={styles.details}>
            {member.position && (
              <Badge
                size="sm"
                variant="neutral"
                icon={<Icon icon={WorkIcon} size={14} />}
                className={styles.position}
                title={member.position}
              >
                {member.position}
              </Badge>
            )}

            {(member.linkedin || member.github) && (
              <div
                className={styles.profiles}
                aria-label="Professional profiles"
              >
                {member.linkedin && (
                  <Tooltip content="Open LinkedIn profile">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.profileLink}
                      aria-label={`${name} on LinkedIn`}
                    >
                      <Icon icon={Linkedin01Icon} size={18} />
                    </a>
                  </Tooltip>
                )}

                {member.github && (
                  <Tooltip content="Open GitHub profile">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.profileLink}
                      aria-label={`${name} on GitHub`}
                    >
                      <Icon icon={GithubIcon} size={18} />
                    </a>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
