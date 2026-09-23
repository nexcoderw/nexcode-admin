"use client";

import {
  Briefcase01Icon,
  File01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { ROUTES } from "@/constants/routes";
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

export function PortfolioForm({
  mode,
  portfolio,
  teamMembers,
}: PortfolioFormProps) {
  const form = usePortfolioForm({
    mode,
    portfolio,
  });

  function error(field: string) {
    return form.fields.includes(field) ? "Check this field." : undefined;
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

      <section className={styles.section}>
        <header>
          <h2>Project information</h2>

          <p>Define the main public information for this portfolio.</p>
        </header>

        <div className={styles.grid}>
          <Input
            label="Name"
            required
            value={form.values.name}
            error={error("name")}
            leftIcon={<Icon icon={Briefcase01Icon} size={18} />}
            onChange={(event) => form.setValue("name", event.target.value)}
          />

          <Select
            label="Category"
            value={form.values.category}
            error={error("category")}
            options={[
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
            ]}
            onChange={(event) => form.setValue("category", event.target.value)}
          />

          <Select
            label="Project type"
            value={form.values.projectType}
            error={error("projectType")}
            options={[
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
            ]}
            onChange={(event) =>
              form.setValue("projectType", event.target.value)
            }
          />

          <Select
            label="Status"
            value={form.values.status}
            error={error("status")}
            options={[
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
            ]}
            onChange={(event) => form.setValue("status", event.target.value)}
          />
        </div>

        <Input
          label="Summary"
          value={form.values.summary}
          error={error("summary")}
          maxLength={300}
          showOptional
          onChange={(event) => form.setValue("summary", event.target.value)}
        />

        <Textarea
          label="Description"
          value={form.values.description}
          error={error("description")}
          rows={7}
          showOptional
          onChange={(event) => form.setValue("description", event.target.value)}
        />
      </section>

      <section className={styles.section}>
        <header>
          <h2>Links and dates</h2>
        </header>

        <div className={styles.grid}>
          <Input
            type="url"
            label="Live URL"
            value={form.values.liveUrl}
            showOptional
            error={error("liveUrl")}
            onChange={(event) => form.setValue("liveUrl", event.target.value)}
          />

          <Input
            type="url"
            label="Figma URL"
            value={form.values.figmaUrl}
            showOptional
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
            error={error("deadlineDate")}
            onChange={(event) =>
              form.setValue("deadlineDate", event.target.value)
            }
          />
        </div>
      </section>

      <section className={styles.section}>
        <header>
          <h2>Team members</h2>

          <p>Select every Team member associated with this project.</p>
        </header>

        {teamMembers.length === 0 ? (
          <p className={styles.emptyTeam}>
            No Team members are currently available.
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
      </section>

      <footer className={styles.actions}>
        <Button
          href={ROUTES.admin.portfolios}
          variant="secondary"
          leftIcon={<Icon icon={UserGroupIcon} size={17} />}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={form.saving}
          loadingLabel="Saving portfolio"
          leftIcon={<Icon icon={File01Icon} size={17} />}
        >
          {mode === "add" ? "Create portfolio" : "Save changes"}
        </Button>
      </footer>
    </form>
  );
}
