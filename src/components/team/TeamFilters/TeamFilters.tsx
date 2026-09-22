import {
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
import type { ResolvedTeamListQuery } from "@/utils/team/team-list-query";

import styles from "./TeamFilters.module.css";

interface TeamFiltersProps {
  query: ResolvedTeamListQuery;
}

const TEAM_ORDERING_OPTIONS = [
  {
    value: "-created_at",
    label: "Newest first",
  },
  {
    value: "created_at",
    label: "Oldest first",
  },
  {
    value: "name",
    label: "Name A–Z",
  },
  {
    value: "-name",
    label: "Name Z–A",
  },
  {
    value: "position",
    label: "Position A–Z",
  },
  {
    value: "-position",
    label: "Position Z–A",
  },
];

export function TeamFilters({ query }: TeamFiltersProps) {
  const filtered = Boolean(query.search) || query.ordering !== "-created_at";

  return (
    <section
      className={styles.filters}
      aria-label="Team filters"
      data-filtered={filtered || undefined}
    >
      <form method="get" action={ROUTES.admin.team} className={styles.form}>
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

        <div className={styles.spacer} aria-hidden="true" />

        <div className={styles.controls}>
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

          <Button
            type="submit"
            size="lg"
            className={styles.applyButton}
            leftIcon={<Icon icon={FilterIcon} size={18} />}
          >
            Apply filters
          </Button>

          {filtered && (
            <Link href={ROUTES.admin.team} className={styles.resetAction}>
              <Icon icon={FilterResetIcon} size={18} />

              <span>Reset</span>
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
