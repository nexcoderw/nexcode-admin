"use client";

import {
  Delete02Icon,
  Mail01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Switch } from "@/components/ui/Switch/Switch";
import { PAYMENT_API_ROUTES } from "@/constants/routes/payment-routes";
import { usePaymentMutation } from "@/hooks/payment/use-payment-mutation";
import type { PaymentReminderRule } from "@/types/payment/reminder";
import {
  describeReminderRule,
  reminderChannelLabel,
} from "@/utils/payment/payment-format";

import styles from "./PaymentReminderRuleRow.module.css";

interface PaymentReminderRuleRowProps {
  rule: PaymentReminderRule;
}

/**
 * One reminder rule: a switch to pause or resume it, and a delete that
 * asks once more, since a deleted rule cannot be restored.
 */
export function PaymentReminderRuleRow({ rule }: PaymentReminderRuleRowProps) {
  const mutation = usePaymentMutation();
  const [confirming, setConfirming] = useState(false);

  const description = describeReminderRule(rule);
  const channel = reminderChannelLabel(rule.channel);

  function setEnabled(isEnabled: boolean) {
    void mutation.mutate(PAYMENT_API_ROUTES.reminderRuleUpdate(rule.id), {
      method: "PATCH",
      failureMessage: "The reminder rule could not be updated.",
      body: { isEnabled },
    });
  }

  function remove() {
    void mutation.mutate(PAYMENT_API_ROUTES.reminderRuleDelete(rule.id), {
      method: "DELETE",
      failureMessage: "The reminder rule could not be deleted.",
    });
  }

  return (
    <li className={styles.rule} data-enabled={rule.isEnabled}>
      <span className={styles.icon} aria-hidden="true">
        <Icon
          icon={rule.channel === "email" ? Mail01Icon : Notification03Icon}
          size={17}
        />
      </span>

      <div className={styles.text}>
        <Switch
          label={description}
          description={`${channel} · ${rule.isEnabled ? "Active" : "Paused"}`}
          checked={rule.isEnabled}
          disabled={mutation.pending}
          error={mutation.error ?? undefined}
          onChange={(changeEvent) => setEnabled(changeEvent.target.checked)}
        />
      </div>

      {confirming ? (
        <div className={styles.confirm}>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={mutation.pending}
            onClick={() => setConfirming(false)}
          >
            Keep
          </Button>

          <Button
            type="button"
            size="sm"
            variant="danger"
            isLoading={mutation.pending}
            loadingLabel="Deleting reminder rule"
            onClick={remove}
          >
            Delete
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          iconOnly
          leftIcon={<Icon icon={Delete02Icon} size={16} />}
          aria-label={`Delete reminder: ${description}`}
          title="Delete reminder"
          onClick={() => setConfirming(true)}
        >
          Delete reminder
        </Button>
      )}
    </li>
  );
}
