"use client";

import { Mail01Icon, SentIcon, TextIcon } from "@hugeicons/core-free-icons";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import {
  type ContactReplyField,
  useContactReply,
} from "@/hooks/contact/useContactReply";
import type { Contact } from "@/types/contact/contact";

import styles from "./ContactReplyForm.module.css";

interface ContactReplyFormProps {
  contact: Contact;
  onCancel: () => void;
  onSent: () => void;
}

const FIELD_MESSAGES: Record<ContactReplyField, string> = {
  subject: "Enter a subject on a single line.",
  message: "Write the reply to send.",
};

export function ContactReplyForm({
  contact,
  onCancel,
  onSent,
}: ContactReplyFormProps) {
  const form = useContactReply({ contact, onSent });

  function error(field: ContactReplyField) {
    return form.fields.includes(field) ? FIELD_MESSAGES[field] : undefined;
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.send();
      }}
    >
      {form.error && (
        <Alert variant="error" title="Reply not sent">
          {form.error}
        </Alert>
      )}

      {/* The recipient is fixed: a reply always goes to the sender. */}
      <div className={styles.recipient}>
        <span className={styles.recipientLabel}>To</span>
        <Icon icon={Mail01Icon} size={16} />
        <span className={styles.recipientValue}>
          {contact.name} &lt;{contact.email}&gt;
        </span>
      </div>

      <Input
        name="subject"
        label="Subject"
        required
        maxLength={255}
        autoComplete="off"
        value={form.values.subject}
        error={error("subject")}
        disabled={form.sending}
        leftIcon={<Icon icon={TextIcon} size={18} />}
        onChange={(event) => form.setValue("subject", event.target.value)}
      />

      <Textarea
        name="message"
        label="Message"
        required
        rows={8}
        maxLength={10000}
        placeholder={`Hi ${contact.name}, thank you for reaching out…`}
        helperText="Sent as a branded NEXCODE email, with their original message quoted below yours."
        value={form.values.message}
        error={error("message")}
        disabled={form.sending}
        onChange={(event) => form.setValue("message", event.target.value)}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          disabled={form.sending}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={form.sending}
          loadingLabel="Sending reply"
          leftIcon={<Icon icon={SentIcon} size={18} />}
        >
          Send reply
        </Button>
      </div>
    </form>
  );
}
