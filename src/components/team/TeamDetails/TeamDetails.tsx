import { GithubIcon, Linkedin01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

import { Icon } from "@/components/ui/Icon/Icon";
import type { TeamMember } from "@/types/team/team";
import { getTeamImageSource } from "@/utils/team/team-image-source";

import styles from "./TeamDetails.module.css";

interface TeamDetailsProps {
  teamMember: TeamMember;
}

export function TeamDetails({ teamMember }: TeamDetailsProps) {
  return (
    <div className={styles.layout}>
      <section className={styles.mediaCard}>
        <TeamImage
          source={teamMember.image}
          alt={`${teamMember.name ?? "Team member"} profile`}
          label="Profile image"
        />

        <TeamImage
          source={teamMember.imagePng}
          alt={`${teamMember.name ?? "Team member"} cutout`}
          label="PNG cutout"
          contain
        />
      </section>

      <section className={styles.detailsCard}>
        <div className={styles.identity}>
          <span className={styles.eyebrow}>Team member</span>

          <h2 className={styles.name}>
            {teamMember.name ?? "Unnamed team member"}
          </h2>

          <p className={styles.position}>
            {teamMember.position ?? "No position specified"}
          </p>
        </div>

        <dl className={styles.details}>
          <DetailRow label="Slug" value={teamMember.slug} />

          <DetailRow label="Created" value={formatDate(teamMember.createdAt)} />

          <DetailRow
            label="Last updated"
            value={formatDate(teamMember.updatedAt)}
          />
        </dl>

        <div className={styles.links}>
          <h3 className={styles.linksTitle}>Professional profiles</h3>

          <div className={styles.linkList}>
            {teamMember.linkedin ? (
              <a
                href={teamMember.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Icon icon={Linkedin01Icon} size={18} />
                LinkedIn
              </a>
            ) : (
              <span className={styles.missingLink}>LinkedIn not provided</span>
            )}

            {teamMember.github ? (
              <a
                href={teamMember.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Icon icon={GithubIcon} size={18} />
                GitHub
              </a>
            ) : (
              <span className={styles.missingLink}>GitHub not provided</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamImage({
  source,
  alt,
  label,
  contain = false,
}: {
  source: string | null;
  alt: string;
  label: string;
  contain?: boolean;
}) {
  const normalized = getTeamImageSource(source);

  return (
    <div className={styles.imageGroup}>
      <span className={styles.imageLabel}>{label}</span>

      <div className={styles.imageFrame}>
        {normalized ? (
          <Image
            src={normalized}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className={contain ? styles.containImage : styles.image}
            unoptimized={normalized.startsWith("/api/team/media")}
          />
        ) : (
          <div className={styles.noImage}>No image available</div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
