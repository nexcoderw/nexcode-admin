"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { CLIENT_API_ROUTES } from "@/constants/routes/client-routes";
import type { Client, ClientInput } from "@/types/client/client";

export type ClientFormValues = Required<ClientInput>;

export type ClientFormField = keyof ClientFormValues;

interface UseClientFormOptions {
  mode: "add" | "edit";
  client?: Client;

  /**
   * Called once the client is saved, so the dialog can close.
   */
  onSaved: () => void;
}

type SaveOutcome =
  | { kind: "saved" }
  | { kind: "unauthenticated" }
  | { kind: "invalid"; fields: string[] }
  | { kind: "failed" };

export function useClientForm({ mode, client, onSaved }: UseClientFormOptions) {
  const router = useRouter();

  const [values, setValues] = useState<ClientFormValues>(() => ({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phoneNumber: client?.phoneNumber ?? "",
  }));

  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function setValue(field: ClientFormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    // Editing a field clears its error, so the message never outlives
    // the value it was about.
    setFields((current) => current.filter((name) => name !== field));
  }

  async function submit() {
    // The one rule worth checking before a round trip: a name is required.
    if (!values.name.trim()) {
      setFields(["name"]);
      return;
    }

    setSaving(true);
    setError(null);
    setFields([]);

    const outcome = await saveClient(mode, client?.id, values);

    setSaving(false);

    if (outcome.kind === "unauthenticated") {
      router.replace(AUTH_ROUTES.login);
      return;
    }

    if (outcome.kind === "invalid") {
      setFields(outcome.fields);
      setError("Check the highlighted fields and try again.");
      return;
    }

    if (outcome.kind === "failed") {
      setError("The client could not be saved. Please try again shortly.");
      return;
    }

    onSaved();
    router.refresh();
  }

  return { values, setValue, submit, saving, fields, error };
}

async function saveClient(
  mode: "add" | "edit",
  clientId: number | undefined,
  values: ClientFormValues,
): Promise<SaveOutcome> {
  try {
    const response = await fetch(
      mode === "add"
        ? CLIENT_API_ROUTES.add
        : CLIENT_API_ROUTES.update(clientId!),
      {
        method: mode === "add" ? "POST" : "PATCH",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phoneNumber: values.phoneNumber.trim(),
        }),
      },
    );

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

    return response.ok ? { kind: "saved" } : { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}
