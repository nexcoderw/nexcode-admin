"use client";

import { Edit02Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import type { Client } from "@/types/client/client";

import { ClientForm } from "../ClientForm/ClientForm";

interface ClientFormDialogProps {
  mode: "add" | "edit";
  open: boolean;
  onClose: () => void;
  client?: Client;
}

export function ClientFormDialog({
  mode,
  open,
  onClose,
  client,
}: ClientFormDialogProps) {
  const adding = mode === "add";
  const name = client?.name ?? "client";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={adding ? "Add client" : `Edit ${name}`}
      description={
        adding
          ? "Record who the client is and how to reach them."
          : "Update this client's name and contact details."
      }
      size="md"
      closeLabel={adding ? "Close add client" : `Close edit ${name}`}
    >
      {/* Mounted only while open, so every opening starts from fresh values. */}
      {open && (
        <ClientForm
          mode={mode}
          client={client}
          onCancel={onClose}
          onSaved={onClose}
        />
      )}
    </Dialog>
  );
}

interface ClientFormDialogTriggerProps {
  mode: "add" | "edit";
  client?: Client;

  /**
   * Render as an icon-only button, for use inside a client card.
   */
  compact?: boolean;
}

export function ClientFormDialogTrigger({
  mode,
  client,
  compact = false,
}: ClientFormDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  const adding = mode === "add";
  const name = client?.name ?? "client";

  return (
    <>
      <Button
        type="button"
        variant={adding ? "primary" : "secondary"}
        size={compact ? "sm" : "md"}
        iconOnly={compact}
        leftIcon={
          <Icon
            icon={adding ? UserAdd01Icon : Edit02Icon}
            size={compact ? 16 : 17}
          />
        }
        aria-label={adding ? "Add client" : `Edit ${name}`}
        title={compact ? `Edit ${name}` : undefined}
        onClick={() => setOpen(true)}
      >
        {adding ? "Add client" : compact ? `Edit ${name}` : "Edit"}
      </Button>

      <ClientFormDialog
        mode={mode}
        client={client}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
