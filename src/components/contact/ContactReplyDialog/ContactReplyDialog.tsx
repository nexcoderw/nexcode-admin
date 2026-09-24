"use client";

import { MailReply01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import type { Contact } from "@/types/contact/contact";
import {
  describeContactDevice,
  formatContactDate,
  getContactInitials,
} from "@/utils/contact/contact-format";

import { ContactReplyForm } from "../ContactReplyForm/ContactReplyForm";

import styles from "./ContactReplyDialog.module.css";

interface ContactReplyDialogProps {
  contact: Contact;
}

/**
 * The "Respond" action on a contact row: shows the full message and a
 * reply form in one dialog, so the admin answers with the message in view.
 */
export function ContactReplyDialog({ contact }: ContactReplyDialogProps) {
  const [open, setOpen] = useState(false);

  const received = formatContactDate(contact.createdAt);
  const replied = Boolean(contact.repliedAt);

  return (
    <>
      <Button
        type="button"
        variant={replied ? "secondary" : "primary"}
        size="sm"
        leftIcon={<Icon icon={MailReply01Icon} size={16} />}
        aria-label={`Respond to ${contact.name}`}
        onClick={() => setOpen(true)}
      >
        Respond
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Respond to ${contact.name}`}
        description="Your reply is emailed to the sender from NEXCODE."
        size="lg"
        closeLabel={`Close reply to ${contact.name}`}
      >
        {/* Mounted only while open, so every opening starts from fresh values. */}
        {open && (
          <div className={styles.body}>
            <article className={styles.original}>
              <header className={styles.sender}>
                <span className={styles.monogram} aria-hidden="true">
                  {getContactInitials(contact.name)}
                </span>

                <span className={styles.senderText}>
                  <strong>{contact.name}</strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>

                <time className={styles.received} dateTime={contact.createdAt}>
                  {received.date}
                  <small>{received.time}</small>
                </time>
              </header>

              <h3 className={styles.subject}>{contact.subject}</h3>

              <p className={styles.message}>{contact.message}</p>

              <footer className={styles.meta}>
                {replied && (
                  <Badge variant="success" size="sm" showDot>
                    Replied before
                  </Badge>
                )}

                <Badge size="sm">{describeContactDevice(contact)}</Badge>

                {contact.ipAddress && (
                  <Badge size="sm" className={styles.ip}>
                    {contact.ipAddress}
                  </Badge>
                )}
              </footer>
            </article>

            <ContactReplyForm
              contact={contact}
              onCancel={() => setOpen(false)}
              onSent={() => setOpen(false)}
            />
          </div>
        )}
      </Dialog>
    </>
  );
}
