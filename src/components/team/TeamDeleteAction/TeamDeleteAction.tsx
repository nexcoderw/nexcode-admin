"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { API_ROUTES, ROUTES } from "@/constants/routes";

import styles from "./TeamDeleteAction.module.css";

interface TeamDeleteActionProps {
  teamId: number;
  teamName: string | null;
}

export function TeamDeleteAction({ teamId, teamName }: TeamDeleteActionProps) {
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="danger"
        leftIcon={<Icon icon={Delete02Icon} size={17} />}
        onClick={() => setConfirming(true)}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className={styles.confirmation}>
      {error && (
        <Alert variant="error" title="Unable to delete">
          {error}
        </Alert>
      )}

      <div className={styles.confirmationContent}>
        <div>
          <strong className={styles.title}>Delete team member?</strong>

          <p className={styles.description}>
            {teamName
              ? `${teamName} will be permanently removed from the Team collection.`
              : "This team member will be permanently removed from the Team collection."}
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            disabled={deleting}
            onClick={() => {
              setConfirming(false);
              setError(null);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            isLoading={deleting}
            loadingLabel="Deleting team member"
            onClick={handleDelete}
          >
            Confirm delete
          </Button>
        </div>
      </div>
    </div>
  );
}
