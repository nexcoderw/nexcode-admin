import type { PortfolioTeamMember } from "@/types/portfolio/portfolio";

import styles from "./PortfolioTeamSection.module.css";

interface PortfolioTeamSectionProps {
  members: PortfolioTeamMember[];
}

export function PortfolioTeamSection({ members }: PortfolioTeamSectionProps) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Team</h2>

        {members.length > 0 && (
          <span className={styles.count}>{members.length}</span>
        )}
      </header>

      {members.length === 0 ? (
        <p className={styles.empty}>
          No team members are assigned to this portfolio yet.
        </p>
      ) : (
        <ul className={styles.list}>
          {members.map((member) => {
            const name = member.name ?? member.slug;

            return (
              <li key={member.id} className={styles.member}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(name)}
                </span>

                <span className={styles.identity}>
                  <strong>{name}</strong>

                  <small>{member.position ?? "Team member"}</small>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * Up to two initials, used in place of a portrait the admin list does
 * not always carry.
 */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
