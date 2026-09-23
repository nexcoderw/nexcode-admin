"use client";

import { Alert02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import { API_ROUTES, ROUTES } from "@/constants/routes";

import styles from "./PortfolioDeleteAction.module.css";

type PortfolioDeleteResource =
  | "portfolio"
  | "image"
  | "document"
  | "repository";

interface PortfolioDeleteActionProps {
  resource: PortfolioDeleteResource;

  resourceId: number;

  name: string;

  compact?: boolean;
}

export function PortfolioDeleteAction({
  resource,
  resourceId,
  name,
  compact = false,
}: PortfolioDeleteActionProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const label = resourceLabel(resource);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(deleteRoute(resource, resourceId), {
        method: "DELETE",
        credentials: "same-origin",

        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        router.replace(ROUTES.auth.login);

        return;
      }

      if (!response.ok && response.status !== 404) {
        setError(`The ${label} could not be deleted.`);

        return;
      }

      setOpen(false);

      if (resource === "portfolio") {
        router.replace(ROUTES.admin.portfolios);
      }

      router.refresh();
    } catch {
      setError(`The ${label} could not be deleted.`);
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
        leftIcon={<Icon icon={Delete02Icon} size={17} />}
        aria-label={compact ? `Delete ${name}` : undefined}
        onClick={() => setOpen(true)}
      >
        Delete {name}
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          if (!deleting) {
            setOpen(false);
            setError(null);
          }
        }}
        title={`Delete ${name}?`}
        description={`This permanently removes the selected ${label}.`}
        size="sm"
        closeOnBackdrop={!deleting}
        footer={
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              disabled={deleting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              isLoading={deleting}
              loadingLabel="Deleting"
              leftIcon={<Icon icon={Delete02Icon} size={17} />}
              onClick={handleDelete}
            >
              Delete permanently
            </Button>
          </div>
        }
      >
        <div className={styles.content}>
          <span className={styles.icon}>
            <Icon icon={Alert02Icon} size={28} />
          </span>

          <div>
            <strong>This cannot be undone</strong>

            <p>{name} will be permanently removed.</p>
          </div>

          {error && (
            <Alert variant="error" title="Unable to delete">
              {error}
            </Alert>
          )}
        </div>
      </Dialog>
    </>
  );
}

function deleteRoute(resource: PortfolioDeleteResource, id: number) {
  switch (resource) {
    case "image":
      return API_ROUTES.portfolio.imageDelete(id);

    case "document":
      return API_ROUTES.portfolio.documentDelete(id);

    case "repository":
      return API_ROUTES.portfolio.repositoryDelete(id);

    default:
      return API_ROUTES.portfolio.delete(id);
  }
}

function resourceLabel(resource: PortfolioDeleteResource) {
  return resource === "portfolio" ? "portfolio" : `portfolio ${resource}`;
}
