"use client";

import {
  GithubIcon,
  Linkedin01Icon,
  UserIcon,
  WorkIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { API_ROUTES, ROUTES } from "@/constants/routes";
import type { TeamMember } from "@/types/team/team";

import { TeamImageField } from "../TeamImageField/TeamImageField";

import styles from "./TeamForm.module.css";

type TeamFormMode = "add" | "edit";

interface TeamFormProps {
  mode: TeamFormMode;
  teamMember?: TeamMember;
}

type FieldErrors = Partial<
  Record<
    "name" | "position" | "linkedin" | "github" | "image" | "image_png",
    string
  >
>;

interface MutationResponse {
  success?: boolean;
  fields?: string[];
  data?: {
    teamMember?: TeamMember;
  };
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function TeamForm({ mode, teamMember }: TeamFormProps) {
  const router = useRouter();

  const [name, setName] = useState(teamMember?.name ?? "");
  const [position, setPosition] = useState(teamMember?.position ?? "");
  const [linkedin, setLinkedin] = useState(teamMember?.linkedin ?? "");
  const [github, setGithub] = useState(teamMember?.github ?? "");

  const [image, setImage] = useState<File | null>(null);
  const [imagePng, setImagePng] = useState<File | null>(null);

  const [removeImage, setRemoveImage] = useState(false);
  const [removeImagePng, setRemoveImagePng] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);

    const validationErrors = validateForm({
      name,
      position,
      linkedin,
      github,
      image,
      imagePng,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();

    formData.set("name", name.trim());
    formData.set("position", position.trim());
    formData.set("linkedin", linkedin.trim());
    formData.set("github", github.trim());

    if (image && !removeImage) {
      formData.set("image", image);
    }

    if (imagePng && !removeImagePng) {
      formData.set("image_png", imagePng);
    }

    if (mode === "edit") {
      if (removeImage) {
        formData.set("remove_image", "true");
      }

      if (removeImagePng) {
        formData.set("remove_image_png", "true");
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        mode === "add"
          ? API_ROUTES.team.add
          : API_ROUTES.team.update(teamMember!.id),
        {
          method: mode === "add" ? "POST" : "PATCH",
          body: formData,
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        },
      );

      let payload: MutationResponse | null = null;

      try {
        payload = (await response.json()) as MutationResponse;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.replace(ROUTES.auth.login);
          router.refresh();
          return;
        }

        if (response.status === 400) {
          setErrors(mapBackendFields(payload?.fields ?? []));
          setFormError(
            "Review the highlighted fields and correct the information provided.",
          );
          return;
        }

        if (response.status === 404 && mode === "edit") {
          setFormError("This team member no longer exists.");
          return;
        }

        setFormError(
          "The team member could not be saved. Please try again shortly.",
        );
        return;
      }

      const returnedId = payload?.data?.teamMember?.id ?? teamMember?.id;

      if (!returnedId) {
        setFormError(
          "The team member was saved, but the returned record could not be identified.",
        );
        return;
      }

      router.push(ROUTES.admin.teamDetail(returnedId));
      router.refresh();
    } catch {
      setFormError(
        "The team service is currently unavailable. Please try again shortly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && (
        <Alert variant="error" title="Unable to save team member">
          {formError}
        </Alert>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Member information</h2>

            <p className={styles.sectionDescription}>
              Core information displayed with this team member&apos;s public
              profile.
            </p>
          </div>
        </div>

        <div className={styles.fields}>
          <Input
            label="Name"
            name="name"
            value={name}
            required
            maxLength={255}
            autoComplete="name"
            disabled={submitting}
            error={errors.name}
            leftIcon={<Icon icon={UserIcon} size={18} />}
            onChange={(event) => {
              setName(event.target.value);
              clearFieldError("name", setErrors);
            }}
          />

          <Input
            label="Position"
            name="position"
            value={position}
            required
            maxLength={255}
            disabled={submitting}
            error={errors.position}
            leftIcon={<Icon icon={WorkIcon} size={18} />}
            onChange={(event) => {
              setPosition(event.target.value);
              clearFieldError("position", setErrors);
            }}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Professional links</h2>

            <p className={styles.sectionDescription}>
              Optional LinkedIn and GitHub profiles associated with this member.
            </p>
          </div>
        </div>

        <div className={styles.fields}>
          <Input
            label="LinkedIn URL"
            name="linkedin"
            type="url"
            value={linkedin}
            showOptional
            placeholder="https://www.linkedin.com/in/..."
            disabled={submitting}
            error={errors.linkedin}
            leftIcon={<Icon icon={Linkedin01Icon} size={18} />}
            onChange={(event) => {
              setLinkedin(event.target.value);
              clearFieldError("linkedin", setErrors);
            }}
          />

          <Input
            label="GitHub URL"
            name="github"
            type="url"
            value={github}
            showOptional
            placeholder="https://github.com/..."
            disabled={submitting}
            error={errors.github}
            leftIcon={<Icon icon={GithubIcon} size={18} />}
            onChange={(event) => {
              setGithub(event.target.value);
              clearFieldError("github", setErrors);
            }}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Profile media</h2>

            <p className={styles.sectionDescription}>
              Manage the standard profile photograph and the transparent cutout
              used by supported NEXCODE interfaces.
            </p>
          </div>
        </div>

        <div className={styles.imageFields}>
          <TeamImageField
            name="image"
            label="Profile image"
            description="Standard profile photograph. JPEG, PNG or WebP up to 10 MB."
            accept="image/jpeg,image/png,image/webp"
            currentImage={teamMember?.image}
            error={errors.image}
            disabled={submitting}
            removable={mode === "edit"}
            onFileChange={(file) => {
              setImage(file);
              clearFieldError("image", setErrors);
            }}
            onRemoveChange={setRemoveImage}
          />

          <TeamImageField
            name="image_png"
            label="Transparent PNG / cutout"
            description="Transparent or isolated member artwork. This file must be a genuine PNG."
            accept="image/png"
            currentImage={teamMember?.imagePng}
            error={errors.image_png}
            disabled={submitting}
            removable={mode === "edit"}
            onFileChange={(file) => {
              setImagePng(file);
              clearFieldError("image_png", setErrors);
            }}
            onRemoveChange={setRemoveImagePng}
          />
        </div>
      </section>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={() => {
            if (mode === "edit" && teamMember) {
              router.push(ROUTES.admin.teamDetail(teamMember.id));
              return;
            }

            router.push(ROUTES.admin.team);
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={submitting}
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

function validateForm({
  name,
  position,
  linkedin,
  github,
  image,
  imagePng,
}: {
  name: string;
  position: string;
  linkedin: string;
  github: string;
  image: File | null;
  imagePng: File | null;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = "Enter the team member's name.";
  }

  if (!position.trim()) {
    errors.position = "Enter the team member's position.";
  }

  if (linkedin && !isAllowedUrl(linkedin, "linkedin.com")) {
    errors.linkedin = "Enter a valid LinkedIn URL.";
  }

  if (github && !isAllowedUrl(github, "github.com")) {
    errors.github = "Enter a valid GitHub URL.";
  }

  if (image && image.size > MAX_IMAGE_BYTES) {
    errors.image = "Profile image must not exceed 10 MB.";
  }

  if (
    image &&
    !["image/jpeg", "image/png", "image/webp"].includes(image.type)
  ) {
    errors.image = "Use a JPEG, PNG or WebP profile image.";
  }

  if (imagePng && imagePng.size > MAX_IMAGE_BYTES) {
    errors.image_png = "PNG cutout must not exceed 10 MB.";
  }

  if (imagePng && imagePng.type !== "image/png") {
    errors.image_png = "The cutout image must be a PNG file.";
  }

  return errors;
}

function isAllowedUrl(value: string, expectedHost: string) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (url.hostname.toLowerCase() === expectedHost ||
        url.hostname.toLowerCase().endsWith(`.${expectedHost}`))
    );
  } catch {
    return false;
  }
}

function mapBackendFields(fields: string[]): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of fields) {
    switch (field) {
      case "name":
        errors.name = "Enter a valid team member name.";
        break;

      case "position":
        errors.position = "Enter a valid position.";
        break;

      case "linkedin":
        errors.linkedin = "Enter a valid LinkedIn URL.";
        break;

      case "github":
        errors.github = "Enter a valid GitHub URL.";
        break;

      case "image":
      case "remove_image":
        errors.image = "Review the profile image.";
        break;

      case "image_png":
      case "remove_image_png":
        errors.image_png = "Review the PNG cutout image.";
        break;
    }
  }

  return errors;
}

function clearFieldError(
  field: keyof FieldErrors,
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
) {
  setErrors((current) => {
    if (!current[field]) {
      return current;
    }

    const next = { ...current };

    delete next[field];

    return next;
  });
}
