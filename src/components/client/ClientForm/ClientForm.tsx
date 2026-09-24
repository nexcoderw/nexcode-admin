"use client";

import {
  Briefcase01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Checkbox,
} from "@/components/ui/Checkbox/Checkbox";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  Input,
} from "@/components/ui/Input/Input";
import {
  Select,
} from "@/components/ui/Select/Select";
import {
  Textarea,
} from "@/components/ui/Textarea/Textarea";
import {
  CLIENT_ROUTES,
} from "@/constants/routes/client-routes";
import {
  useClientForm,
} from "@/hooks/client/useClientForm";
import type {
  ClientDetail,
} from "@/types/client/client";

import styles from "./ClientForm.module.css";

interface ClientFormProps {
  mode: "add" | "edit";
  client?: ClientDetail;
}

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

const FIELD_MESSAGES:
  Record<
    string,
    string
  > = {
    name:
      "Enter the client name.",

    companyName:
      "Check the company name.",

    email:
      "Enter a valid email address.",

    phone:
      "Check the phone number.",

    website:
      "Enter a complete website URL.",

    location:
      "Check the client location.",

    profileImage:
      "Use a JPEG, PNG or WebP image no larger than 10 MB.",

    notes:
      "Check the client notes.",

    status:
      "Choose a valid client status.",
  };

export function ClientForm({
  mode,
  client,
}: ClientFormProps) {
  const form =
    useClientForm({
      mode,
      client,
    });

  function error(
    field: string,
  ) {
    if (
      !form.fields.includes(
        field,
      )
    ) {
      return undefined;
    }

    return (
      FIELD_MESSAGES[field] ??
      "Check this field."
    );
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
        <Alert
          variant="error"
          title="Unable to save"
        >
          {form.error}
        </Alert>
      )}

      {form.success && (
        <Alert
          variant="success"
          title="Client updated"
        >
          The client details have been saved.
        </Alert>
      )}

      <section
        className={
          styles.section
        }
      >
        <header
          className={
            styles.sectionHeader
          }
        >
          <span
            className={
              styles.index
            }
          >
            01
          </span>

          <div>
            <h2>
              Client information
            </h2>

            <p>
              Core identity and lifecycle information for this client.
            </p>
          </div>
        </header>

        <div
          className={
            styles.sectionBody
          }
        >
          <div
            className={
              styles.grid
            }
          >
            <Input
              label="Client name"
              required
              value={
                form.values.name
              }
              error={
                error("name")
              }
              placeholder="GRACON Tech Holdings"
              leftIcon={
                <Icon
                  icon={
                    UserGroupIcon
                  }
                  size={18}
                />
              }
              onChange={
                (event) =>
                  form.setValue(
                    "name",
                    event.target
                      .value,
                  )
              }
            />

            <Input
              label="Company name"
              showOptional
              value={
                form.values
                  .companyName
              }
              error={
                error(
                  "companyName",
                )
              }
              placeholder="GRACON Tech Holdings Ltd"
              leftIcon={
                <Icon
                  icon={
                    Briefcase01Icon
                  }
                  size={18}
                />
              }
              onChange={
                (event) =>
                  form.setValue(
                    "companyName",
                    event.target
                      .value,
                  )
              }
            />

            <Select
              label="Status"
              value={
                form.values.status
              }
              options={
                STATUS_OPTIONS
              }
              error={
                error("status")
              }
              helperText="Archived clients remain stored but are kept outside the active lifecycle."
              onChange={
                (event) =>
                  form.setValue(
                    "status",
                    event.target
                      .value,
                  )
              }
            />
          </div>
        </div>
      </section>

      <section
        className={
          styles.section
        }
      >
        <header
          className={
            styles.sectionHeader
          }
        >
          <span
            className={
              styles.index
            }
          >
            02
          </span>

          <div>
            <h2>
              Contact details
            </h2>

            <p>
              Optional contact and location information for internal reference.
            </p>
          </div>
        </header>

        <div
          className={
            styles.sectionBody
          }
        >
          <div
            className={
              styles.grid
            }
          >
            <Input
              type="email"
              label="Email"
              showOptional
              value={
                form.values.email
              }
              error={
                error("email")
              }
              placeholder="client@example.com"
              onChange={
                (event) =>
                  form.setValue(
                    "email",
                    event.target
                      .value,
                  )
              }
            />

            <Input
              type="tel"
              label="Phone"
              showOptional
              value={
                form.values.phone
              }
              error={
                error("phone")
              }
              placeholder="+250..."
              onChange={
                (event) =>
                  form.setValue(
                    "phone",
                    event.target
                      .value,
                  )
              }
            />

            <Input
              type="url"
              label="Website"
              showOptional
              value={
                form.values
                  .website
              }
              error={
                error("website")
              }
              placeholder="https://example.com"
              onChange={
                (event) =>
                  form.setValue(
                    "website",
                    event.target
                      .value,
                  )
              }
            />

            <Input
              label="Location"
              showOptional
              value={
                form.values
                  .location
              }
              error={
                error("location")
              }
              placeholder="Kigali, Rwanda"
              onChange={
                (event) =>
                  form.setValue(
                    "location",
                    event.target
                      .value,
                  )
              }
            />
          </div>
        </div>
      </section>

      <section
        className={
          styles.section
        }
      >
        <header
          className={
            styles.sectionHeader
          }
        >
          <span
            className={
              styles.index
            }
          >
            03
          </span>

          <div>
            <h2>
              Profile and notes
            </h2>

            <p>
              Add a profile image and any internal context useful for managing the relationship.
            </p>
          </div>
        </header>

        <div
          className={
            styles.sectionBody
          }
        >
          <Input
            type="file"
            label="Profile image"
            showOptional
            accept="image/jpeg,image/png,image/webp"
            error={
              error(
                "profileImage",
              )
            }
            helperText="JPEG, PNG or WebP. Maximum 10 MB."
            onChange={
              (event) =>
                form.selectImage(
                  event.target
                    .files?.[0] ??
                    null,
                )
            }
          />

          {client?.profileImage &&
            !form.profileImage && (
              <Checkbox
                label="Remove current profile image"
                description="The existing image will be deleted after the client update succeeds."
                checked={
                  form.removeProfileImage
                }
                onChange={() =>
                  form.setRemoveImage(
                    !form.removeProfileImage,
                  )
                }
              />
            )}

          <Textarea
            label="Notes"
            showOptional
            rows={7}
            value={
              form.values.notes
            }
            error={
              error("notes")
            }
            placeholder="Internal client notes..."
            onChange={
              (event) =>
                form.setValue(
                  "notes",
                  event.target
                    .value,
                )
            }
          />
        </div>
      </section>

      <footer
        className={
          styles.actions
        }
      >
        <span
          className={
            styles.actionsHint
          }
        >
          {mode === "add"
            ? "The client becomes available immediately after creation."
            : "The stable client slug is preserved when the name changes."}
        </span>

        <div
          className={
            styles.actionsButtons
          }
        >
          <Button
            href={
              mode === "edit" &&
              client
                ? CLIENT_ROUTES.detail(
                    client.id,
                  )
                : CLIENT_ROUTES.list
            }
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={
              form.saving
            }
            loadingLabel="Saving client"
          >
            {mode === "add"
              ? "Create client"
              : "Save changes"}
          </Button>
        </div>
      </footer>
    </form>
  );
}