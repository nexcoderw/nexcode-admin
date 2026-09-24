"use client";

import {
  CancelCircleHalfDotIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { TEAM_ROUTES } from "@/constants/routes/team-routes";
import {
  DEFAULT_TEAM_ORDERING,
  type ResolvedTeamListQuery,
} from "@/utils/team/team-list-query";

import styles from "./TeamFiltersDialog.module.css";

interface TeamFiltersDialogProps {
  query: ResolvedTeamListQuery;
}

const TEAM_ORDERING_OPTIONS = [
  { value: "display_order", label: "Display order" },
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
  { value: "-name", label: "Name Z–A" },
  { value: "position", label: "Position A–Z" },
  { value: "-position", label: "Position Z–A" },
];

export function TeamFiltersDialog({ query }: TeamFiltersDialogProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    Number(Boolean(query.search)) +
    Number(query.ordering !== DEFAULT_TEAM_ORDERING);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={<Icon icon={FilterIcon} size={18} />}
        aria-label={
          activeCount > 0 ? `Filters, ${activeCount} active` : undefined
        }
        onClick={() => setOpen(true)}
      >
        Filters
        {activeCount > 0 && (
          <span className={styles.count} aria-hidden="true">
            {activeCount}
          </span>
        )}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Filter team"
        description="Narrow the list by name, position or profile, and choose the order members appear in."
        size="sm"
        closeLabel="Close team filters"
      >
        {open && (
          <form
            method="get"
            action={TEAM_ROUTES.list}
            className={styles.form}
          >
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

            <Select
              id="team-ordering"
              name="ordering"
              label="Sort by"
              defaultValue={query.ordering}
              options={TEAM_ORDERING_OPTIONS}
              leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
            />

            {/*
             * The actions stay inside the form rather than in the dialog
             * footer, so the submit button belongs to the form it sends.
             */}
            <div className={styles.actions}>
              {activeCount > 0 && (
                <Button
                  href={TEAM_ROUTES.list}
                  variant="ghost"
                  className={styles.reset}
                  leftIcon={<Icon icon={FilterResetIcon} size={18} />}
                >
                  Reset
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                leftIcon={<Icon icon={CancelCircleHalfDotIcon} size={18} />}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                leftIcon={<Icon icon={FilterIcon} size={18} />}
              >
                Apply filters
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}
