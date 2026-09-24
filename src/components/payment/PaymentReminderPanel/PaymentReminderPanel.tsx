"use client";

import {
  Add01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

import { PaymentReminderRuleRow } from "@/components/payment/PaymentReminderRuleRow/PaymentReminderRuleRow";
import { Alert } from "@/components/ui/Alert/Alert";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import {
  REMINDER_CHANNEL_OPTIONS,
  REMINDER_EVENT_OPTIONS,
  REMINDER_TIMING_OPTIONS,
} from "@/constants/payment/payment-options";
import { PAYMENT_API_ROUTES } from "@/constants/routes/payment-routes";
import { usePaymentMutation } from "@/hooks/payment/use-payment-mutation";
import type {
  PaymentReminderChannel,
  PaymentReminderEvent,
  PaymentReminderRule,
  PaymentReminderTiming,
} from "@/types/payment/reminder";

import styles from "./PaymentReminderPanel.module.css";

interface PaymentReminderPanelProps {
  agreementId: number;
  rules: PaymentReminderRule[];
}

const MAX_DAYS = 3650;

function parseDays(value: string) {
  const days = Number(value);

  return Number.isInteger(days) && days >= 1 && days <= MAX_DAYS
    ? days
    : null;
}

export function PaymentReminderPanel({
  agreementId,
  rules,
}: PaymentReminderPanelProps) {
  const mutation = usePaymentMutation();

  const [event, setEvent] = useState<PaymentReminderEvent>("installment_due");
  const [timing, setTiming] = useState<PaymentReminderTiming>("before");
  const [days, setDays] = useState("7");
  const [channel, setChannel] = useState<PaymentReminderChannel>("in_app");
  const [daysInvalid, setDaysInvalid] = useState(false);

  const enabledCount = rules.filter((rule) => rule.isEnabled).length;

  async function addRule() {
    const parsedDays = timing === "on" ? 0 : parseDays(days);

    if (parsedDays === null) {
      setDaysInvalid(true);
      return;
    }

    await mutation.mutate(PAYMENT_API_ROUTES.reminderRuleAdd(agreementId), {
      method: "POST",
      failureMessage: "The reminder rule could not be created.",
      body: { event, timing, days: parsedDays, channel, isEnabled: true },
    });
  }

  const daysError =
    daysInvalid || mutation.fields.includes("days")
      ? `Enter a whole number of days from 1 to ${MAX_DAYS}.`
      : undefined;

  return (
    <section className={styles.panel} aria-labelledby="reminder-rules-title">
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Automation</span>
          <h2 id="reminder-rules-title">Reminder rules</h2>
        </div>

        <Badge size="sm" variant={enabledCount > 0 ? "primary" : "neutral"}>
          {enabledCount} of {rules.length} active
        </Badge>
      </header>

      {mutation.error && (
        <Alert variant="error" title="Reminder action failed">
          {mutation.error}
        </Alert>
      )}

      <form
        className={styles.form}
        noValidate
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          void addRule();
        }}
      >
        <Select
          label="Event"
          value={event}
          options={[...REMINDER_EVENT_OPTIONS]}
          disabled={mutation.pending}
          onChange={(changeEvent) =>
            setEvent(changeEvent.target.value as PaymentReminderEvent)
          }
        />

        <Select
          label="Timing"
          value={timing}
          options={[...REMINDER_TIMING_OPTIONS]}
          disabled={mutation.pending}
          onChange={(changeEvent) =>
            setTiming(changeEvent.target.value as PaymentReminderTiming)
          }
        />

        {timing !== "on" && (
          <Input
            label="Days"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_DAYS}
            value={days}
            error={daysError}
            disabled={mutation.pending}
            onChange={(changeEvent) => {
              setDays(changeEvent.target.value);
              setDaysInvalid(false);
            }}
          />
        )}

        <Select
          label="Channel"
          value={channel}
          options={[...REMINDER_CHANNEL_OPTIONS]}
          disabled={mutation.pending}
          onChange={(changeEvent) =>
            setChannel(changeEvent.target.value as PaymentReminderChannel)
          }
        />

        <Button
          type="submit"
          className={styles.submit}
          isLoading={mutation.pending}
          loadingLabel="Adding reminder rule"
          leftIcon={<Icon icon={Add01Icon} size={17} />}
        >
          Add rule
        </Button>
      </form>

      {rules.length === 0 ? (
        <div className={styles.empty}>
          <Icon icon={Notification03Icon} size={22} />
          <p>
            No reminders yet. Add a rule to be alerted before payments fall
            due.
          </p>
        </div>
      ) : (
        <ul className={styles.rules}>
          {rules.map((rule) => (
            <PaymentReminderRuleRow key={rule.id} rule={rule} />
          ))}
        </ul>
      )}
    </section>
  );
}
