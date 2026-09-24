"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CONTACT_API_ROUTES } from "@/constants/routes/contact-routes";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import type { Contact, ContactReplyInput } from "@/types/contact/contact";
import { replySubject } from "@/utils/contact/contact-format";

export type ContactReplyField = keyof ContactReplyInput;

interface UseContactReplyOptions {
  contact: Contact;

  /**
   * Called once the email is sent, so the dialog can close.
   */
  onSent: () => void;
}

type SendOutcome =
  | { kind: "sent" }
  | { kind: "unauthenticated" }
  | { kind: "invalid"; fields: string[] }
  | { kind: "not-delivered" }
  | { kind: "failed" };

export function useContactReply({ contact, onSent }: UseContactReplyOptions) {
  const router = useRouter();

  const [values, setValues] = useState<ContactReplyInput>(() => ({
    subject: replySubject(contact.subject),
    message: "",
  }));

  const [sending, setSending] = useState(false);
  const [fields, setFields] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function setValue(field: ContactReplyField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    // Editing a field clears its error, so the message never outlives
    // the value it was about.
    setFields((current) => current.filter((name) => name !== field));
  }

  async function send() {
    const missing = (["subject", "message"] as const).filter(
      (field) => !values[field].trim(),
    );

    if (missing.length > 0) {
      setFields(missing);
      return;
    }

    setSending(true);
    setError(null);
    setFields([]);

    const outcome = await sendReply(contact.id, values);

    setSending(false);

    if (outcome.kind === "unauthenticated") {
      router.replace(AUTH_ROUTES.login);
      return;
    }

    if (outcome.kind === "invalid") {
      setFields(outcome.fields);
      setError("Check the highlighted fields and try again.");
      return;
    }

    if (outcome.kind === "not-delivered") {
      setError(
        "The email could not be delivered. Your reply is still here, so you can try again shortly.",
      );
      return;
    }

    if (outcome.kind === "failed") {
      setError("The reply could not be sent. Please try again shortly.");
      return;
    }

    onSent();
    router.refresh();
  }

  return { values, setValue, send, sending, fields, error };
}

async function sendReply(
  contactId: number,
  values: ContactReplyInput,
): Promise<SendOutcome> {
  try {
    const response = await fetch(CONTACT_API_ROUTES.reply(contactId), {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: values.subject.trim(),
        message: values.message.trim(),
      }),
    });

    if (response.status === 401 || response.status === 403) {
      return { kind: "unauthenticated" };
    }

    if (response.status === 400) {
      const result = await response.json().catch(() => null);

      return {
        kind: "invalid",
        fields: Array.isArray(result?.fields) ? result.fields : [],
      };
    }

    if (response.status === 502) {
      return { kind: "not-delivered" };
    }

    return response.ok ? { kind: "sent" } : { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}
