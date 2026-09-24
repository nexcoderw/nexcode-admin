"use client";

import {
  CancelCircleHalfDotIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  MailOpen01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { CONTACT_ROUTES } from "@/constants/routes/contact-routes";
import {
  isContactQueryFiltered,
  type ResolvedContactListQuery,
} from "@/utils/contact/contact-page-query";

import styles from "./ContactFiltersDialog.module.css";

interface ContactFiltersDialogProps {
  query: ResolvedContactListQuery;
}

const STATUS_OPTIONS = [
  { value: "", label: "All messages" },
  { value: "new", label: "New" },
  { value: "replied", label: "Replied" },
];

const ORDER_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "name", label: "Sender A–Z" },
  { value: "-name", label: "Sender Z–A" },
];

export function ContactFiltersDialog({ query }: ContactFiltersDialogProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    Number(Boolean(query.search)) +
    Number(Boolean(query.status)) +
    Number(query.ordering !== "-created_at");

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={<Icon icon={FilterIcon} size={18} />}
        onClick={() => setOpen(true)}
      >
        Filters
        {activeCount > 0 && (
          <span className={styles.count}>{activeCount}</span>
        )}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Filter messages"
        description="Search by sender, email, subject or IP address, and narrow to new or replied messages."
        size="md"
        closeLabel="Close message filters"
      >
        {open && (
          <form method="get" action={CONTACT_ROUTES.list} className={styles.form}>
            <Input
              name="search"
              type="search"
              label="Search"
              defaultValue={query.search}
              placeholder="Name, email, subject or IP address"
              maxLength={100}
              leftIcon={<Icon icon={Search01Icon} size={18} />}
            />

            <div className={styles.grid}>
              <Select
                name="status"
                label="Status"
                options={STATUS_OPTIONS}
                defaultValue={query.status}
                leftIcon={<Icon icon={MailOpen01Icon} size={18} />}
              />

              <Select
                name="ordering"
                label="Sort by"
                options={ORDER_OPTIONS}
                defaultValue={query.ordering}
                leftIcon={<Icon icon={FilterHorizontalIcon} size={18} />}
              />
            </div>

            <div className={styles.actions}>
              {isContactQueryFiltered(query) && (
                <Button
                  href={CONTACT_ROUTES.list}
                  variant="ghost"
                  leftIcon={<Icon icon={FilterResetIcon} size={18} />}
                  className={styles.reset}
                >
                  Reset
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                leftIcon={<Icon icon={CancelCircleHalfDotIcon} size={18} />}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" leftIcon={<Icon icon={FilterIcon} size={18} />}>
                Apply filters
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}
