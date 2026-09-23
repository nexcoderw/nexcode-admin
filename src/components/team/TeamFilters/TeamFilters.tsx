import {
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { ROUTES } from "@/constants/routes";
import type { ResolvedTeamListQuery } from "@/utils/team/team-list-query";

import styles from "./TeamFilters.module.css";

interface TeamFiltersProps {
  query: ResolvedTeamListQuery;
}

const DEFAULT_ORDERING = "-created_at";

const TEAM_ORDERING_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
  { value: "-name", label: "Name Z–A" },
  { value: "position", label: "Position A–Z" },
  { value: "-position", label: "Position Z–A" },
];

export function TeamFilters({ query }: TeamFiltersProps) {
  const filtered =
    Boolean(query.search) || query.ordering !== DEFAULT_ORDERING;

  return (
    <form
      method="get"
      action={ROUTES.admin.team}
      className={styles.filters}
      aria-label="Team filters"
      data-filtered={filtered || undefined}
    >
      <div className={styles.search}>
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
          className={styles.apply}
          leftIcon={<Icon icon={FilterIcon} size={17} />}
        >
          Apply
        </Button>

        {filtered && (
          <Button
            href={ROUTES.admin.team}
            variant="ghost"
            size="lg"
            iconOnly
            title="Reset filters"
            leftIcon={<Icon icon={FilterResetIcon} size={18} />}
          >
            Reset filters
          </Button>
        )}
      </div>
    </form>
  );
}
