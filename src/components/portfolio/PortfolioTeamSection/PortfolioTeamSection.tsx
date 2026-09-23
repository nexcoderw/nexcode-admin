import type { PortfolioTeamMember } from "@/types/portfolio/portfolio";

import styles from "./PortfolioTeamSection.module.css";

interface PortfolioTeamSectionProps {
  members: PortfolioTeamMember[];
}

export function PortfolioTeamSection({ members }: PortfolioTeamSectionProps) {
  return (
    <section className={styles.section}>
      <h2>Team</h2>

      {members.length === 0 ? (
        <p className={styles.empty}>
          No team members are assigned to this portfolio yet.
        </p>
      ) : (
        <div className={styles.simpleList}>
          {members.map((member) => (
            <div key={member.id}>
              <strong>{member.name ?? member.slug}</strong>

              <span>{member.position ?? "Team member"}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
