import type { TeamMember } from "@/types/team/team";

import { TeamCard } from "../TeamCard/TeamCard";

import styles from "./TeamGrid.module.css";

interface TeamGridProps {
  items: TeamMember[];
}

export function TeamGrid({ items }: TeamGridProps) {
  return (
    <section className={styles.grid} aria-label="Team members">
      {items.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </section>
  );
}
