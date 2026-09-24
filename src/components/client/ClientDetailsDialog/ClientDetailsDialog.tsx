"use client";

import {
  Call02Icon,
  Copy01Icon,
  Edit02Icon,
  Mail01Icon,
  Tick02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import type { Client } from "@/types/client/client";
import {
  formatClientDate,
  getClientInitials,
} from "@/utils/client/client-format";

import { ClientDeleteAction } from "../ClientDeleteAction/ClientDeleteAction";
import { ClientFormDialog } from "../ClientFormDialog/ClientFormDialog";

import styles from "./ClientDetailsDialog.module.css";

interface ClientDetailsDialogProps {
  client: Client;
}

export function ClientDetailsDialog({ client }: ClientDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        iconOnly
        leftIcon={<Icon icon={ViewIcon} size={16} />}
        aria-label={`View ${client.name}`}
        title={`View ${client.name}`}
        onClick={() => setOpen(true)}
      >
        View {client.name}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={client.name}
        description="Client contact record"
        size="md"
        closeLabel={`Close ${client.name} details`}
        footer={
          open ? (
            <div className={styles.footer}>
              <ClientDeleteAction
                clientId={client.id}
                name={client.name}
                onDeleted={() => setOpen(false)}
              />

              <div className={styles.footerEnd}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>

                <Button
                  type="button"
                  leftIcon={<Icon icon={Edit02Icon} size={17} />}
                  onClick={() => {
                    setOpen(false);
                    setEditing(true);
                  }}
                >
                  Edit client
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {open && (
          <div className={styles.body}>
            <div className={styles.identity}>
              <span className={styles.monogram} aria-hidden="true">
                {getClientInitials(client.name)}
              </span>

              <span className={styles.identityText}>
                <strong>{client.name}</strong>
                <small>Client since {formatClientDate(client.createdAt)}</small>
              </span>
            </div>

            <dl className={styles.contacts}>
              <ContactRow
                icon={Mail01Icon}
                label="Email"
                value={client.email}
                href={client.email ? `mailto:${client.email}` : undefined}
              />

              <ContactRow
                icon={Call02Icon}
                label="Phone number"
                value={client.phoneNumber}
                href={
                  client.phoneNumber
                    ? `tel:${client.phoneNumber.replace(/\s+/g, "")}`
                    : undefined
                }
              />
            </dl>

            <p className={styles.meta}>
              Last updated {formatClientDate(client.updatedAt)}
            </p>
          </div>
        )}
      </Dialog>

      <ClientFormDialog
        mode="edit"
        client={client}
        open={editing}
        onClose={() => setEditing(false)}
      />
    </>
  );
}

interface ContactRowProps {
  icon: typeof Mail01Icon;
  label: string;
  value: string | null;
  href?: string;
}

function ContactRow({ icon, label, value, href }: ContactRowProps) {
  return (
    <div className={styles.contact}>
      <span className={styles.contactIcon} aria-hidden="true">
        <Icon icon={icon} size={18} />
      </span>

      <div className={styles.contactText}>
        <dt>{label}</dt>

        <dd>
          {value && href ? (
            <a href={href}>{value}</a>
          ) : (
            <span className={styles.missing}>Not provided</span>
          )}
        </dd>
      </div>

      {value && <CopyButton value={value} label={label} />}
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const action = copied ? `${label} copied` : `Copy ${label.toLowerCase()}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be refused; the value stays on screen to
      // copy by hand, so there is nothing further to report.
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      iconOnly
      leftIcon={<Icon icon={copied ? Tick02Icon : Copy01Icon} size={16} />}
      aria-label={action}
      title={action}
      onClick={() => void copy()}
    >
      {action}
    </Button>
  );
}
