"use client";

import {
  Edit02Icon,
  UserAdd01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import type { TeamMember } from "@/types/team/team";

import { TeamForm, type TeamFormMode } from "../TeamForm/TeamForm";

import styles from "./TeamFormDialog.module.css";

interface TeamFormDialogProps {
  mode: TeamFormMode;
  open: boolean;
  onClose: () => void;
  teamMember?: TeamMember;
}

export function TeamFormDialog({
  mode,
  open,
  onClose,
  teamMember,
}: TeamFormDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const name = teamMember?.name ?? "team member";
  const adding = mode === "add";

  function handleClose() {
    if (!submitting) {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={adding ? "Add team member" : `Edit ${name}`}
      description={
        adding
          ? "Create a public team profile with professional links and imagery."
          : "Refine this member's public identity, profiles and imagery."
      }
      size="lg"
      className={styles.formDialog}
      closeLabel={adding ? "Close add team member" : `Close edit ${name}`}
      closeOnBackdrop={!submitting}
    >
      {open && (
        <div className={styles.content}>
          <div className={styles.contextBar}>
            <span className={styles.contextIcon} aria-hidden="true">
              <Icon icon={adding ? UserAdd01Icon : UserIcon} size={21} />
            </span>

            <div>
              <strong>
                {adding ? "New public profile" : "Profile workspace"}
              </strong>
              <span>Identity, professional links and media in one place.</span>
            </div>
          </div>

          <TeamForm
            mode={mode}
            teamMember={teamMember}
            onCancel={handleClose}
            onSuccess={onClose}
            onSubmittingChange={setSubmitting}
          />
        </div>
      )}
    </Dialog>
  );
}

interface TeamFormDialogTriggerProps {
  mode: TeamFormMode;
  teamMember?: TeamMember;
  compact?: boolean;
}

export function TeamFormDialogTrigger({
  mode,
  teamMember,
  compact = false,
}: TeamFormDialogTriggerProps) {
  const [open, setOpen] = useState(false);
  const adding = mode === "add";
  const name = teamMember?.name ?? "team member";

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
            size={compact ? 10 : 18}
          />
        }
        aria-label={adding ? "Add team member" : `Edit ${name}`}
        title={compact ? `Edit ${name}` : undefined}
        onClick={() => setOpen(true)}
      >
        {adding ? "Add team member" : compact ? `Edit ${name}` : "Edit"}
      </Button>

      <TeamFormDialog
        mode={mode}
        teamMember={teamMember}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
