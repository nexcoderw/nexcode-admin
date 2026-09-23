"use client";

import { Briefcase01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { PORTFOLIO_ROUTES } from "@/constants/routes/portfolio-routes";
import { usePortfolioForm } from "@/hooks/portfolio/usePortfolioForm";
import type { PortfolioDetail } from "@/types/portfolio/portfolio";

import styles from "./PortfolioForm.module.css";

/**
 * The fields this form needs to render one selectable member. Kept
 * minimal so both a full TeamMember and the reduced member embedded in
 * a portfolio satisfy it, which lets the edit page fall back to the
 * portfolio's own members when the team list is unavailable.
 */
export interface PortfolioFormTeamMember {
  id: number;
  name: string | null;
  slug: string;
  position: string | null;
}

interface PortfolioFormProps {
  mode: "add" | "edit";

  portfolio?: PortfolioDetail;

  teamMembers: PortfolioFormTeamMember[];
}

const SUMMARY_LIMIT = 300;

const CATEGORY_OPTIONS = [
  { value: "web_application", label: "Web application" },
  { value: "mobile_application", label: "Mobile application" },
  { value: "ui_ux", label: "UI/UX" },
  { value: "branding", label: "Branding" },
];

const PROJECT_TYPE_OPTIONS = [
  { value: "client_project", label: "Client project" },
  { value: "student_project", label: "Student project" },
  { value: "learning_project", label: "Learning project" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

/**
 * What each field means when the backend rejects it. A message that
 * names the problem is the difference between a form a user can fix and
 * one they have to guess at.
 */
const FIELD_MESSAGES: Record<string, string> = {
  name: "Enter a project name.",
  category: "Choose a category.",
  projectType: "Choose a project type.",
  status: "Choose a status.",
  summary: `Keep the summary within ${SUMMARY_LIMIT} characters.`,
  description: "Check the description.",
  liveUrl: "Enter a full URL, starting with https://",
  figmaUrl: "Enter a full Figma URL, starting with https://",
  projectInitiationDate: "Enter a valid date.",
  deadlineDate: "The deadline cannot be earlier than the initiation date.",
  teamMemberIds: "Select at least one available Team member.",
};

export function PortfolioForm({
  mode,
  portfolio,
  teamMembers,
}: PortfolioFormProps) {
  const form = usePortfolioForm({
    mode,
    portfolio,
  });

  const selectedCount = form.values.teamMemberIds.length;

  const summaryLength = form.values.summary.length;

  function error(field: string) {
    if (!form.fields.includes(field)) {
      return undefined;
    }

    return FIELD_MESSAGES[field] ?? "Check this field.";
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
    >
      {form.error && (
        <Alert variant="error" title="Unable to save">
          {form.error}
        </Alert>
      )}

      {form.success && (
        <Alert variant="success" title="Portfolio updated">
          The portfolio details have been saved.
        </Alert>
      )}

      <Section
        index="01"
        title="Project information"
        description="The name, classification and copy shown wherever this project appears."
      >
        <div className={styles.grid}>
          <Input
            label="Name"
            required
            value={form.values.name}
            error={error("name")}
            placeholder="NEXCODE Platform"
            leftIcon={<Icon icon={Briefcase01Icon} size={18} />}
            onChange={(event) => form.setValue("name", event.target.value)}
          />

          <Select
            label="Category"
            value={form.values.category}
            error={error("category")}
            options={CATEGORY_OPTIONS}
            onChange={(event) => form.setValue("category", event.target.value)}
          />

          <Select
            label="Project type"
            value={form.values.projectType}
            error={error("projectType")}
            options={PROJECT_TYPE_OPTIONS}
            onChange={(event) =>
              form.setValue("projectType", event.target.value)
            }
          />

          <Select
            label="Status"
            value={form.values.status}
            error={error("status")}
            helperText="Drafts stay hidden from the public site."
            options={STATUS_OPTIONS}
            onChange={(event) => form.setValue("status", event.target.value)}
          />
        </div>

        <Input
          label="Summary"
          value={form.values.summary}
          error={error("summary")}
          maxLength={SUMMARY_LIMIT}
          showOptional
          placeholder="One sentence shown on the portfolio card."
          helperText={`${summaryLength} of ${SUMMARY_LIMIT} characters used.`}
          onChange={(event) => form.setValue("summary", event.target.value)}
        />

        <Textarea
          label="Description"
          value={form.values.description}
          error={error("description")}
          rows={7}
          showOptional
          helperText="The full write-up shown on the project's detail page."
          onChange={(event) => form.setValue("description", event.target.value)}
        />
      </Section>

      <Section
        index="02"
        title="Links and dates"
        description="Optional references and the schedule this project ran to."
      >
        <div className={styles.grid}>
          <Input
            type="url"
            label="Live URL"
            value={form.values.liveUrl}
            showOptional
            placeholder="https://example.com"
            error={error("liveUrl")}
            onChange={(event) => form.setValue("liveUrl", event.target.value)}
          />

          <Input
            type="url"
            label="Figma URL"
            value={form.values.figmaUrl}
            showOptional
            placeholder="https://figma.com/file/..."
            error={error("figmaUrl")}
            onChange={(event) => form.setValue("figmaUrl", event.target.value)}
          />

          <Input
            type="date"
            label="Initiation date"
            value={form.values.projectInitiationDate}
            showOptional
            error={error("projectInitiationDate")}
            onChange={(event) =>
              form.setValue("projectInitiationDate", event.target.value)
            }
          />

          <Input
            type="date"
            label="Deadline"
            value={form.values.deadlineDate}
            showOptional
            min={form.values.projectInitiationDate || undefined}
            helperText="Must fall on or after the initiation date."
            error={error("deadlineDate")}
            onChange={(event) =>
              form.setValue("deadlineDate", event.target.value)
            }
          />
        </div>
      </Section>

      <Section
        index="03"
        title="Team members"
        description="Everyone credited on this project."
        aside={
          selectedCount > 0 ? (
            <div className={styles.selection}>
              <span className={styles.selectionCount}>
                {selectedCount} selected
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => form.setValue("teamMemberIds", [])}
              >
                Clear
              </Button>
            </div>
          ) : undefined
        }
      >
        {teamMembers.length === 0 ? (
          <p className={styles.emptyTeam}>
            No Team members are currently available. Add them under Team, then
            return to credit them here.
          </p>
        ) : (
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <Checkbox
                key={member.id}
                label={member.name ?? member.slug}
                description={member.position ?? undefined}
                checked={form.values.teamMemberIds.includes(member.id)}
                onChange={() => form.toggleTeam(member.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {/*
       * The actions stay in view on a long form, so saving never means
       * scrolling to the bottom first.
       */}
      <footer className={styles.actions}>
        <span className={styles.actionsHint}>
          {mode === "add"
            ? "Images and links can be added once the project exists."
            : "Changes apply as soon as they are saved."}
        </span>

        <div className={styles.actionsButtons}>
          <Button href={PORTFOLIO_ROUTES.list} variant="secondary">
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={form.saving}
            loadingLabel="Saving portfolio"
          >
            {mode === "add" ? "Create portfolio" : "Save changes"}
          </Button>
        </div>
      </footer>
    </form>
  );
}

function Section({
  index,
  title,
  description,
  aside,
  children,
}: {
  index: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <div>
          <span className={styles.index} aria-hidden="true">
            {index}
          </span>

          <h2>{title}</h2>

          <p>{description}</p>
        </div>

        {aside}
      </header>

      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
