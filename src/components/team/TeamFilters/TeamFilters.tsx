import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import type { ResolvedTeamListQuery } from "@/utils/team/team-list-query";

import styles from "./TeamFilters.module.css";

interface TeamFiltersProps {
  query: ResolvedTeamListQuery;
}

export function TeamFilters({ query }: TeamFiltersProps) {
  const filtered = Boolean(query.search) || query.ordering !== "-created_at";

  return (
    <section className={styles.filters} aria-label={"Team filters"}>
      <form method="get" action={ROUTES.admin.team} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="team-search" className={styles.label}>
            Search
          </label>

          <input
            id="team-search"
            type="search"
            name="search"
            defaultValue={query.search}
            className={styles.input}
            placeholder={"Name, position or profile"}
            maxLength={100}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="team-ordering" className={styles.label}>
            Sort by
          </label>

          <select
            id="team-ordering"
            name="ordering"
            defaultValue={query.ordering}
            className={styles.select}
          >
            <option value="-created_at">Newest first</option>

            <option value="created_at">Oldest first</option>

            <option value="name">Name A–Z</option>

            <option value="-name">Name Z–A</option>

            <option value="position">Position A–Z</option>

            <option value="-position">Position Z–A</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.apply}>
            Apply filters
          </button>

          {filtered && (
            <Link href={ROUTES.admin.team} className={styles.reset}>
              Reset
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
