import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import type { TeamMember } from "@/types/team/team";

import { TeamAvatar } from "../TeamAvatar/TeamAvatar";

import styles from "./TeamTable.module.css";

interface TeamTableProps {
  items: TeamMember[];
}

export function TeamTable({ items }: TeamTableProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Member</th>

              <th scope="col">Position</th>

              <th scope="col">Profiles</th>

              <th scope="col">Updated</th>

              <th scope="col" className={styles.actionsHeading}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((member) => (
              <TeamRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamRow({ member }: { member: TeamMember }) {
  return (
    <tr>
      <td>
        <div className={styles.member}>
          <TeamAvatar
            name={member.name}
            image={member.image}
            imagePng={member.imagePng}
          />

          <div className={styles.memberText}>
            <strong>{member.name ?? "Unnamed member"}</strong>

            <span>{member.slug}</span>
          </div>
        </div>
      </td>

      <td className={styles.secondary}>{member.position ?? "—"}</td>

      <td>
        <div className={styles.profiles}>
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}

          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}

          {!member.linkedin && !member.github && (
            <span className={styles.secondary}>—</span>
          )}
        </div>
      </td>

      <td className={styles.secondary}>{formatDate(member.updatedAt)}</td>

      <td>
        <div className={styles.actions}>
          <Link
            href={ROUTES.admin.teamDetail(member.id)}
            className={styles.viewAction}
          >
            View
          </Link>

          <Link
            href={ROUTES.admin.teamEdit(member.id)}
            className={styles.editAction}
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
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
