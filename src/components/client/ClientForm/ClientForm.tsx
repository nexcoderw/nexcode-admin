"use client";

import {
  Call02Icon,
  Mail01Icon,
  SendIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import {
  type ClientFormField,
  useClientForm,
} from "@/hooks/client/useClientForm";
import type { Client } from "@/types/client/client";
import { getClientInitials } from "@/utils/client/client-format";

import styles from "./ClientForm.module.css";

interface ClientFormProps {
  mode: "add" | "edit";
  client?: Client;
  onCancel: () => void;
  onSaved: () => void;
}

/**
 * What each field means when it is rejected, so the message names the
 * fix rather than just flagging the field.
 */
const FIELD_MESSAGES: Record<ClientFormField, string> = {
  name: "Enter the client's name.",
  email: "Enter a valid email address, like name@company.com.",
  phoneNumber: "Enter a phone number of up to 50 characters.",
};

export function ClientForm({
  mode,
  client,
  onCancel,
  onSaved,
}: ClientFormProps) {
  const form = useClientForm({ mode, client, onSaved });

  const previewName = form.values.name.trim();
  const previewEmail = form.values.email.trim();

  function error(field: ClientFormField) {
    return form.fields.includes(field) ? FIELD_MESSAGES[field] : undefined;
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
    >
      {/* A live preview of how the client will appear across the admin. */}
      <div className={styles.preview} aria-hidden="true">
        <span className={styles.monogram}>
          {previewName ? (
            getClientInitials(previewName)
          ) : (
            <Icon icon={UserIcon} size={20} />
          )}
        </span>

        <span className={styles.previewText}>
          <strong>{previewName || "New client"}</strong>
          <small>{previewEmail || "No email address yet"}</small>
        </span>
      </div>

      {form.error && (
        <Alert variant="error" title="Unable to save client">
          {form.error}
        </Alert>
      )}

      <div className={styles.fields}>
        <Input
          name="name"
          label="Name"
          required
          maxLength={255}
          autoComplete="off"
          placeholder="Acme Rwanda"
          value={form.values.name}
          error={error("name")}
          disabled={form.saving}
          leftIcon={<Icon icon={UserIcon} size={18} />}
          onChange={(event) => form.setValue("name", event.target.value)}
        />

        <Input
          name="email"
          type="email"
          label="Email"
          showOptional
          autoComplete="off"
          placeholder="hello@acme.rw"
          value={form.values.email}
          error={error("email")}
          disabled={form.saving}
          leftIcon={<Icon icon={Mail01Icon} size={18} />}
          onChange={(event) => form.setValue("email", event.target.value)}
        />

        <Input
          name="phoneNumber"
          type="tel"
          label="Phone number"
          showOptional
          maxLength={50}
          autoComplete="off"
          placeholder="+250 788 000 000"
          value={form.values.phoneNumber}
          error={error("phoneNumber")}
          disabled={form.saving}
          leftIcon={<Icon icon={Call02Icon} size={18} />}
          onChange={(event) =>
            form.setValue("phoneNumber", event.target.value)
          }
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          disabled={form.saving}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={form.saving}
          loadingLabel="Saving client"
          leftIcon={<Icon icon={SendIcon} size={18} />}
        >
          {mode === "add" ? "Add client" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
