import {
  Cancel01Icon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { ROUTES } from "@/constants/routes";
import type { TeamOrdering } from "@/types/team/team";
import type { ResolvedTeamListQuery } from "@/utils/team/team-list-query";

import styles from "./TeamFilters.module.css";

interface TeamFiltersProps {
  query: ResolvedTeamListQuery;
}

const DEFAULT_ORDERING: TeamOrdering = "-created_at";

const TEAM_ORDERING_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
  { value: "-name", label: "Name Z–A" },
  { value: "position", label: "Position A–Z" },
  { value: "-position", label: "Position Z–A" },
];

export function TeamFilters({ query }: TeamFiltersProps) {
  const hasSearch = Boolean(query.search);
  const hasOrdering = query.ordering !== DEFAULT_ORDERING;
  const activeCount = Number(hasSearch) + Number(hasOrdering);

  return (
    <section
      className={styles.filters}
      aria-label="Team filters"
      data-filtered={activeCount > 0 || undefined}
    >
      <div className={styles.rail}>
        <span className={styles.railLabel}>
          <Icon icon={FilterIcon} size={15} />
          Refine
        </span>

        <span className={styles.railStatus}>
          {activeCount === 0
            ? "Showing every team member"
            : `${activeCount} filter${activeCount > 1 ? "s" : ""} active`}
        </span>
      </div>

      <form method="get" action={ROUTES.admin.team} className={styles.form}>
        <div className={styles.field}>
          <Input
            id="team-search"
            type="search"
            name="search"
            label="Search"
            defaultValue={query.search}
            placeholder="Name, position or profile"
            maxLength={100}
            autoComplete="off"
            leftIcon={<Icon icon={Search01Icon} size={18} />}
          />
        </div>

        <div className={styles.sort}>
          <Select
            id="team-ordering"
            name="ordering"
            label="Sort by"
            defaultValue={query.ordering}
            options={TEAM_ORDERING_OPTIONS}
            leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            size="lg"
            className={styles.action}
            leftIcon={<Icon icon={FilterIcon} size={18} />}
          >
            Apply filters
          </Button>

          {activeCount > 0 && (
            <Button
              href={ROUTES.admin.team}
              variant="secondary"
              size="lg"
              className={styles.action}
              leftIcon={<Icon icon={FilterResetIcon} size={18} />}
            >
              Reset
            </Button>
          )}
        </div>
      </form>

      {activeCount > 0 && (
        <ul className={styles.chips} aria-label="Active filters">
          {hasSearch && (
            <Chip
              label="Search"
              value={query.search}
              href={filterHref(query, { search: "" })}
            />
          )}

          {hasOrdering && (
            <Chip
              label="Sorted by"
              value={orderingLabel(query.ordering)}
              href={filterHref(query, { ordering: DEFAULT_ORDERING })}
            />
          )}
        </ul>
      )}
    </section>
  );
}

function Chip({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <li className={styles.chip}>
      <span className={styles.chipLabel}>{label}</span>

      <span className={styles.chipValue}>{value}</span>

      <Link
        href={href}
        className={styles.chipClear}
        aria-label={`Clear ${label.toLowerCase()} filter`}
      >
        <Icon icon={Cancel01Icon} size={14} />
      </Link>
    </li>
  );
}

function orderingLabel(ordering: TeamOrdering) {
  return (
    TEAM_ORDERING_OPTIONS.find((option) => option.value === ordering)?.label ??
    ordering
  );
}

/**
 * Builds the team list href for the current query with individual
 * criteria replaced. Pagination always restarts, because a narrower
 * result set rarely keeps the same page meaningful.
 */
function filterHref(
  query: ResolvedTeamListQuery,
  overrides: { search?: string; ordering?: TeamOrdering },
) {
  const search = overrides.search ?? query.search;
  const ordering = overrides.ordering ?? query.ordering;

  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (ordering !== DEFAULT_ORDERING) {
    params.set("ordering", ordering);
  }

  const queryString = params.toString();

  return queryString ? `${ROUTES.admin.team}?${queryString}` : ROUTES.admin.team;
}
