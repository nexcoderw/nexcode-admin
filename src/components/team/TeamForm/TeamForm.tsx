"use client";

import {
  CancelCircleHalfDotIcon,
  GithubIcon,
  Linkedin01Icon,
  SendIcon,
  SortingIcon,
  UserIcon,
  WorkIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { TEAM_API_ROUTES } from "@/constants/routes/team-routes";
import type { TeamMember } from "@/types/team/team";

import { TeamImageField } from "../TeamImageField/TeamImageField";

import styles from "./TeamForm.module.css";

export type TeamFormMode = "add" | "edit";

interface TeamFormProps {
  mode: TeamFormMode;
  teamMember?: TeamMember;
  onCancel: () => void;
  onSuccess: () => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

type TextField = "name" | "position" | "linkedin" | "github";
type MediaField = "image" | "image_png";
type TeamField = TextField | MediaField | "display_order";

type TextValues = Record<TextField, string>;
type MediaFiles = Record<MediaField, File | null>;
type MediaRemovals = Record<MediaField, boolean>;
type FieldErrors = Partial<Record<TeamField, string>>;

interface TextFieldConfig {
  name: TextField;
  label: string;
  icon: typeof UserIcon;
  type?: "url";
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

const IDENTITY_FIELDS: readonly TextFieldConfig[] = [
  { name: "name", label: "Name", icon: UserIcon, autoComplete: "name" },
  { name: "position", label: "Position", icon: WorkIcon },
];

const LINK_FIELDS: readonly TextFieldConfig[] = [
  {
    name: "linkedin",
    label: "LinkedIn URL",
    icon: Linkedin01Icon,
    type: "url",
    optional: true,
    placeholder: "https://www.linkedin.com/in/...",
  },
  {
    name: "github",
    label: "GitHub URL",
    icon: GithubIcon,
    type: "url",
    optional: true,
    placeholder: "https://github.com/...",
  },
];

const MEDIA_FIELDS = [
  {
    name: "image",
    label: "Profile image",
    description: "Standard profile photograph. JPEG, PNG or WebP up to 10 MB.",
    accept: "image/jpeg,image/png,image/webp",
    types: ["image/jpeg", "image/png", "image/webp"],
    typeError: "Use a JPEG, PNG or WebP profile image.",
    sizeError: "Profile image must not exceed 10 MB.",
  },
  {
    name: "image_png",
    label: "Transparent PNG / cutout",
    description:
      "Transparent member artwork. This file must be a genuine PNG.",
    accept: "image/png",
    types: ["image/png"],
    typeError: "The cutout image must be a PNG file.",
    sizeError: "PNG cutout must not exceed 10 MB.",
  },
] as const satisfies ReadonlyArray<{
  name: MediaField;
  label: string;
  description: string;
  accept: string;
  types: readonly string[];
  typeError: string;
  sizeError: string;
}>;

const BACKEND_FIELD_ERRORS: Record<string, [TeamField, string]> = {
  name: ["name", "Enter a valid team member name."],
  display_order: ["display_order", "Enter a whole number, 0 or higher."],
  position: ["position", "Enter a valid position."],
  linkedin: ["linkedin", "Enter a valid LinkedIn URL."],
  github: ["github", "Enter a valid GitHub URL."],
  image: ["image", "Review the profile image."],
  remove_image: ["image", "Review the profile image."],
  image_png: ["image_png", "Review the PNG cutout image."],
  remove_image_png: ["image_png", "Review the PNG cutout image."],
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

interface MutationResponse {
  fields?: string[];
}

export function TeamForm({
  mode,
  teamMember,
  onCancel,
  onSuccess,
  onSubmittingChange,
}: TeamFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<TextValues>(() => ({
    name: teamMember?.name ?? "",
    position: teamMember?.position ?? "",
    linkedin: teamMember?.linkedin ?? "",
    github: teamMember?.github ?? "",
  }));

  const [files, setFiles] = useState<MediaFiles>({
    image: null,
    image_png: null,
  });

  const [removals, setRemovals] = useState<MediaRemovals>({
    image: false,
    image_png: false,
  });

  // Empty on a new member: the backend then places them after everyone else.
  const [displayOrder, setDisplayOrder] = useState(
    teamMember ? String(teamMember.displayOrder) : "",
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * A single change handler shared by every text input, so no per-field
   * closure is allocated on render.
   */
  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as TextField;
    const { value } = event.target;

    setValues((current) => ({ ...current, [field]: value }));
    clearError(field);
  }

  function clearError(field: TeamField) {
    setErrors((current) =>
      current[field] ? omitField(current, field) : current,
    );
  }

  function reportErrors(nextErrors: FieldErrors) {
    setErrors(nextErrors);
    focusFirstError(formRef.current, nextErrors);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);

    const validationErrors = validate(values, files, displayOrder);

    if (Object.keys(validationErrors).length > 0) {
      reportErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      const response = await fetch(
        mode === "add"
          ? TEAM_API_ROUTES.add
          : TEAM_API_ROUTES.update(teamMember!.id),
        {
          method: mode === "add" ? "POST" : "PATCH",
          body: buildFormData(mode, values, files, removals, displayOrder),
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        },
      );

      if (response.ok) {
        onSuccess();
        router.refresh();
        return;
      }

      if (response.status === 401 || response.status === 403) {
        router.replace(AUTH_ROUTES.login);
        router.refresh();
        return;
      }

      if (response.status === 400) {
        const payload = (await response
          .json()
          .catch(() => null)) as MutationResponse | null;

        reportErrors(mapBackendFields(payload?.fields ?? []));
        setFormError(
          "Review the highlighted fields and correct the information provided.",
        );
        return;
      }

      setFormError(
        response.status === 404 && mode === "edit"
          ? "This team member no longer exists."
          : "The team member could not be saved. Please try again shortly.",
      );
    } catch {
      setFormError(
        "The team service is currently unavailable. Please try again shortly.",
      );
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }

  function renderTextFields(fields: readonly TextFieldConfig[]) {
    return fields.map((field) => (
      <Input
        key={field.name}
        name={field.name}
        label={field.label}
        type={field.type}
        value={values[field.name]}
        required={!field.optional}
        showOptional={field.optional}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        maxLength={255}
        disabled={submitting}
        error={errors[field.name]}
        leftIcon={<Icon icon={field.icon} size={18} />}
        onChange={handleTextChange}
      />
    ));
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {formError && (
        <Alert variant="error" title="Unable to save team member">
          {formError}
        </Alert>
      )}

      <Section index="01" title="Identity" hint="Name and role">
        <div className={styles.grid}>
          {renderTextFields(IDENTITY_FIELDS)}

          <Input
            label="Display order"
            name="display_order"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            showOptional={mode === "add"}
            placeholder={mode === "add" ? "Last" : undefined}
            helperText={
              mode === "add"
                ? "Lower numbers appear first. Leave empty to place this member last."
                : "Lower numbers appear first on the website."
            }
            value={displayOrder}
            disabled={submitting}
            error={errors.display_order}
            leftIcon={<Icon icon={SortingIcon} size={18} />}
            onChange={(event) => {
              setDisplayOrder(event.target.value);
              clearError("display_order");
            }}
          />
        </div>
      </Section>

      <Section index="02" title="Profiles" hint="Professional links, optional">
        <div className={styles.grid}>{renderTextFields(LINK_FIELDS)}</div>
      </Section>

      <Section index="03" title="Media" hint="Portrait and cutout">
        <div className={styles.grid}>
          {MEDIA_FIELDS.map((field) => (
            <TeamImageField
              key={field.name}
              name={field.name}
              label={field.label}
              description={field.description}
              accept={field.accept}
              currentImage={
                field.name === "image"
                  ? teamMember?.image
                  : teamMember?.imagePng
              }
              error={errors[field.name]}
              disabled={submitting}
              removable={mode === "edit"}
              onFileChange={(file) => {
                setFiles((current) => ({ ...current, [field.name]: file }));
                clearError(field.name);
              }}
              onRemoveChange={(remove) => {
                setRemovals((current) => ({
                  ...current,
                  [field.name]: remove,
                }));
              }}
            />
          ))}
        </div>
      </Section>

      <div className={styles.actions}>
        <Button
          type="button"
          size="lg"
          variant="secondary"
          disabled={submitting}
          leftIcon={<Icon icon={CancelCircleHalfDotIcon} size={18} />}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          size="lg"
          isLoading={submitting}
          leftIcon={<Icon icon={SendIcon} size={18} />}
          loadingLabel={
            mode === "add" ? "Adding team member" : "Saving team member"
          }
        >
          {mode === "add" ? "Add team member" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  index,
  title,
  hint,
  children,
}: {
  index: string;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.aside}>
        <span className={styles.index} aria-hidden="true">
          {index}
        </span>

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.hint}>{hint}</p>
      </div>

      <div className={styles.body}>{children}</div>
    </section>
  );
}

function buildFormData(
  mode: TeamFormMode,
  values: TextValues,
  files: MediaFiles,
  removals: MediaRemovals,
  displayOrder: string,
) {
  const formData = new FormData();

  if (displayOrder.trim()) {
    formData.set("display_order", displayOrder.trim());
  }

  for (const [field, value] of Object.entries(values)) {
    formData.set(field, value.trim());
  }

  for (const field of MEDIA_FIELDS) {
    const file = files[field.name];

    if (file && !removals[field.name]) {
      formData.set(field.name, file);
    }

    if (mode === "edit" && removals[field.name]) {
      formData.set(`remove_${field.name}`, "true");
    }
  }

  return formData;
}

function validate(
  values: TextValues,
  files: MediaFiles,
  displayOrder: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (displayOrder.trim() && !/^\d+$/.test(displayOrder.trim())) {
    errors.display_order = "Enter a whole number, 0 or higher.";
  }

  if (!values.name.trim()) {
    errors.name = "Enter the team member's name.";
  }

  if (!values.position.trim()) {
    errors.position = "Enter the team member's position.";
  }

  if (values.linkedin && !isAllowedUrl(values.linkedin, "linkedin.com")) {
    errors.linkedin = "Enter a valid LinkedIn URL.";
  }

  if (values.github && !isAllowedUrl(values.github, "github.com")) {
    errors.github = "Enter a valid GitHub URL.";
  }

  for (const field of MEDIA_FIELDS) {
    const file = files[field.name];

    if (!file) {
      continue;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      errors[field.name] = field.sizeError;
    } else if (!(field.types as readonly string[]).includes(file.type)) {
      errors[field.name] = field.typeError;
    }
  }

  return errors;
}

function isAllowedUrl(value: string, expectedHost: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (hostname === expectedHost || hostname.endsWith(`.${expectedHost}`))
    );
  } catch {
    return false;
  }
}

function mapBackendFields(fields: string[]): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of fields) {
    const mapped = BACKEND_FIELD_ERRORS[field];

    if (mapped) {
      errors[mapped[0]] = mapped[1];
    }
  }

  return errors;
}

function omitField(errors: FieldErrors, field: TeamField) {
  const next = { ...errors };

  delete next[field];

  return next;
}

function focusFirstError(form: HTMLFormElement | null, errors: FieldErrors) {
  if (!form) {
    return;
  }

  const [field] = Object.keys(errors);

  if (!field) {
    return;
  }

  const control = form.elements.namedItem(field);

  // Focusing scrolls the control into view, so nothing else is needed here.
  if (control instanceof HTMLElement) {
    control.focus();
  }
}
