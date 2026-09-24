"use client";

import {
  Alert02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import {
  useRouter,
} from "next/navigation";
import {
  useState,
} from "react";

import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Dialog,
} from "@/components/ui/Dialog/Dialog";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  PAYMENT_API_ROUTES,
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  usePaymentMutation,
} from "@/hooks/payment/use-payment-mutation";

import styles from "./DeleteAgreementDialog.module.css";

interface DeleteAgreementDialogProps {
  agreementId: number;
  title: string;
  disabled?: boolean;
}

export function DeleteAgreementDialog({
  agreementId,
  title,
  disabled = false,
}: DeleteAgreementDialogProps) {
  const router =
    useRouter();

  const [open, setOpen] =
    useState(false);

  const mutation =
    usePaymentMutation();

  async function remove() {
    const result =
      await mutation.mutate(
        PAYMENT_API_ROUTES
          .agreementDelete(
            agreementId,
          ),
        {
          method: "DELETE",

          failureMessage:
            "The payment agreement could not be deleted.",
        },
      );

    if (!result) {
      return;
    }

    router.replace(
      PAYMENT_ROUTES.list,
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="danger"
        disabled={disabled}
        leftIcon={
          <Icon
            icon={
              Delete02Icon
            }
            size={17}
          />
        }
        onClick={() =>
          setOpen(true)
        }
      >
        Delete agreement
      </Button>

      <Dialog
        open={open}
        onClose={() =>
          !mutation.pending &&
          setOpen(false)
        }
        title={`Delete ${title}?`}
        description="Only draft agreements with no recorded payments can be deleted."
        size="sm"
      >
        <div
          className={
            styles.content
          }
        >
          <span
            className={
              styles.icon
            }
          >
            <Icon
              icon={
                Alert02Icon
              }
              size={28}
            />
          </span>

          <strong>
            This removes the draft financial agreement.
          </strong>

          {mutation.error && (
            <Alert
              variant="error"
              title="Unable to delete"
            >
              {mutation.error}
            </Alert>
          )}

          <div
            className={
              styles.actions
            }
          >
            <Button
              type="button"
              variant="secondary"
              disabled={
                mutation.pending
              }
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              isLoading={
                mutation.pending
              }
              leftIcon={
                <Icon
                  icon={
                    Delete02Icon
                  }
                  size={17}
                />
              }
              onClick={() =>
                void remove()
              }
            >
              Delete agreement
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}