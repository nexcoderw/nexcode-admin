"use client";

import { Alert02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import { API_ROUTES, ROUTES } from "@/constants/routes";

import styles from "./TeamDeleteAction.module.css";

interface TeamDeleteActionProps {
  teamId: number;
  teamName: string | null;
  compact?: boolean;
}

export function TeamDeleteAction({
  teamId,
  teamName,
  compact = false,
}: TeamDeleteActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = teamName ?? "this team member";

  function closeDialog() {
    if (deleting) {
      return;
    }

    setOpen(false);
    setError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.team.delete(teamId), {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        router.replace(ROUTES.auth.login);
        router.refresh();
        return;
      }

      if (response.status === 404) {
        setOpen(false);
        router.replace(ROUTES.admin.team);
        router.refresh();
        return;
      }

      if (!response.ok) {
        setError(
          "The team member could not be deleted. Please try again shortly.",
        );
        return;
      }

      setOpen(false);
      router.replace(ROUTES.admin.team);
      router.refresh();
    } catch {
      setError(
        "The team service is currently unavailable. Please try again shortly.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="danger"
        size={compact ? "sm" : "md"}
        iconOnly={compact}
        leftIcon={<Icon icon={Delete02Icon} size={compact ? 10 : 17} />}
        aria-label={compact ? `Delete ${name}` : undefined}
        title={compact ? `Delete ${name}` : undefined}
        onClick={() => setOpen(true)}
      >
        {compact ? `Delete ${name}` : "Delete"}
      </Button>

      <Dialog
        open={open}
        onClose={closeDialog}
        title={`Delete ${name}?`}
        description="This action permanently removes the profile from the team."
        size="sm"
        closeLabel="Close delete confirmation"
        closeOnBackdrop={!deleting}
        className={styles.deleteDialog}
        footer={
          open ? (
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                disabled={deleting}
                onClick={closeDialog}
              >
                Keep member
              </Button>

              <Button
                type="button"
                variant="danger"
                isLoading={deleting}
                loadingLabel={`Deleting ${name}`}
                onClick={handleDelete}
              >
                Delete permanently
              </Button>
            </div>
          ) : undefined
        }
      >
        {open && (
          <div className={styles.content}>
            <span className={styles.warningIcon} aria-hidden="true">
              <Icon icon={Alert02Icon} size={28} />
            </span>

            <div className={styles.warningCopy}>
              <strong>This cannot be undone</strong>
              <p>
                The profile, standard photograph and transparent cutout for
                {teamName ? ` ${teamName}` : " this member"} will no longer be
                available to NEXCODE interfaces.
              </p>
            </div>

            <div className={styles.memberRecord}>
              <span>Profile selected for deletion</span>
              <strong>{name}</strong>
            </div>

            {error && (
              <Alert variant="error" title="Unable to delete">
                {error}
              </Alert>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}
