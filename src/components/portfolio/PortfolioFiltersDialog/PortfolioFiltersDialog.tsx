"use client";

import {
  CancelCircleHalfDotIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  Search01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { ROUTES } from "@/constants/routes";
import type { TeamMember } from "@/types/team/team";
import type { ResolvedPortfolioListQuery } from "@/utils/portfolio/portfolio-page-query";

import styles from "./PortfolioFiltersDialog.module.css";

interface PortfolioFiltersDialogProps {
  query: ResolvedPortfolioListQuery;

  teamMembers: TeamMember[];
}

const CATEGORY_OPTIONS = [
  {
    value: "",
    label: "All categories",
  },
  {
    value: "web_application",
    label: "Web application",
  },
  {
    value: "mobile_application",
    label: "Mobile application",
  },
  {
    value: "ui_ux",
    label: "UI/UX",
  },
  {
    value: "branding",
    label: "Branding",
  },
];

const PROJECT_TYPE_OPTIONS = [
  {
    value: "",
    label: "All project types",
  },
  {
    value: "client_project",
    label: "Client project",
  },
  {
    value: "student_project",
    label: "Student project",
  },
  {
    value: "learning_project",
    label: "Learning project",
  },
];

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All statuses",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "published",
    label: "Published",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

const ORDER_OPTIONS = [
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
    value: "deadline_date",
    label: "Deadline earliest",
  },
  {
    value: "-deadline_date",
    label: "Deadline latest",
  },
];

export function PortfolioFiltersDialog({
  query,
  teamMembers,
}: PortfolioFiltersDialogProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    Number(Boolean(query.search)) +
    Number(Boolean(query.category)) +
    Number(Boolean(query.projectType)) +
    Number(Boolean(query.status)) +
    Number(Boolean(query.teamMemberId)) +
    Number(query.ordering !== "-created_at");

  const teamOptions = [
    {
      value: "",
      label: "All team members",
    },
    ...teamMembers.map((member) => ({
      value: String(member.id),

      label: member.name ?? member.slug,
    })),
  ];

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={<Icon icon={FilterIcon} size={18} />}
        onClick={() => setOpen(true)}
      >
        Filters
        {activeCount > 0 && <span className={styles.count}>{activeCount}</span>}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Filter portfolios"
        description="Narrow portfolios by project information, status or assigned team member."
        size="md"
        closeLabel="Close portfolio filters"
      >
        {open && (
          <form
            method="get"
            action={ROUTES.admin.portfolios}
            className={styles.form}
          >
            <Input
              name="search"
              type="search"
              label="Search"
              defaultValue={query.search}
              placeholder="Name, summary or description"
              maxLength={100}
              leftIcon={<Icon icon={Search01Icon} size={18} />}
            />

            <div className={styles.grid}>
              <Select
                name="category"
                label="Category"
                options={CATEGORY_OPTIONS}
                defaultValue={query.category}
                leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
              />

              <Select
                name="projectType"
                label="Project type"
                options={PROJECT_TYPE_OPTIONS}
                defaultValue={query.projectType}
                leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
              />

              <Select
                name="status"
                label="Status"
                options={STATUS_OPTIONS}
                defaultValue={query.status}
                leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
              />

              <Select
                name="teamMemberId"
                label="Team member"
                options={teamOptions}
                defaultValue={
                  query.teamMemberId ? String(query.teamMemberId) : ""
                }
                leftIcon={<Icon icon={UserGroupIcon} size={18} />}
              />
            </div>

            <Select
              name="ordering"
              label="Sort by"
              options={ORDER_OPTIONS}
              defaultValue={query.ordering}
              leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
            />

            <div className={styles.actions}>
              {activeCount > 0 && (
                <Button
                  href={ROUTES.admin.portfolios}
                  variant="ghost"
                  leftIcon={<Icon icon={FilterResetIcon} size={18} />}
                  className={styles.reset}
                >
                  Reset
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                leftIcon={<Icon icon={CancelCircleHalfDotIcon} size={18} />}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
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
