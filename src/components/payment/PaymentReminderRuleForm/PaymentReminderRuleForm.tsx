"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Alert } from "@/components/ui/Alert/Alert";
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
  PaymentReminderTiming,
} from "@/types/payment/reminder";
import { kigaliDate } from "@/utils/payment/payment-format";

import styles from "./PaymentReminderRuleForm.module.css";

type ReminderMode = "relative" | "date";

const MODES: { value: ReminderMode; label: string }[] = [
  { value: "relative", label: "Relative to a due date" },
  { value: "date", label: "On a specific date" },
];

// The set-date option is its own mode, so the dropdown keeps only offsets.
const RELATIVE_TIMINGS = REMINDER_TIMING_OPTIONS.filter(
  (option) => option.value !== "date",
);

const MAX_DAYS = 3650;

// What a dated reminder covers on the day, for each event.
const DATE_HINTS: Record<PaymentReminderEvent, string> = {
  installment_due: "On that day you are reminded about the next unpaid installment.",
  milestone_expected: "On that day you are reminded about the next unconfirmed milestone.",
  agreement_expiry: "On that day you are reminded that the agreement is ending.",
};

function parseDays(value: string) {
  const days = Number(value);

  return Number.isInteger(days) && days >= 1 && days <= MAX_DAYS ? days : null;
}

export function PaymentReminderRuleForm({ agreementId }: { agreementId: number }) {
  const mutation = usePaymentMutation();

  const [mode, setMode] = useState<ReminderMode>("relative");
  const [event, setEvent] = useState<PaymentReminderEvent>("installment_due");
  const [timing, setTiming] = useState<PaymentReminderTiming>("before");
  const [days, setDays] = useState("7");
  const [remindOn, setRemindOn] = useState(() => kigaliDate(1));
  const [channel, setChannel] = useState<PaymentReminderChannel>("in_app");
  const [invalid, setInvalid] = useState<"days" | "remindOn" | null>(null);

  const today = kigaliDate();
  const dated = mode === "date";

  function fieldError(field: "days" | "remindOn", message: string) {
    return invalid === field || mutation.fields.includes(field)
      ? message
      : undefined;
  }

  async function addRule() {
    let timingFields: {
      timing: PaymentReminderTiming;
      days: number;
      remindOn?: string;
    };

    if (dated) {
      // ISO dates compare correctly as strings.
      if (!remindOn || remindOn < today) {
        setInvalid("remindOn");
        return;
      }

      timingFields = { timing: "date", days: 0, remindOn };
    } else {
      const parsedDays = timing === "on" ? 0 : parseDays(days);

      if (parsedDays === null) {
        setInvalid("days");
        return;
      }

      timingFields = { timing, days: parsedDays };
    }

    await mutation.mutate(PAYMENT_API_ROUTES.reminderRuleAdd(agreementId), {
      method: "POST",
      failureMessage: "The reminder could not be created.",
      body: { event, ...timingFields, channel, isEnabled: true },
    });
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(submitEvent) => {
        submitEvent.preventDefault();
        void addRule();
      }}
    >
      {mutation.error && (
        <Alert variant="error" title="Reminder not added">
          {mutation.error}
        </Alert>
      )}

      <fieldset className={styles.modes} disabled={mutation.pending}>
        <legend className={styles.srOnly}>When to remind</legend>

        {MODES.map((option) => (
          <label key={option.value} className={styles.mode}>
            <input
              type="radio"
              name="reminder-mode"
              value={option.value}
              checked={mode === option.value}
              onChange={() => {
                setMode(option.value);
                setInvalid(null);
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.fields}>
        {dated && (
          <Input
            label="Remind me on"
            type="date"
            min={today}
            value={remindOn}
            aria-describedby="reminder-date-hint"
            error={fieldError("remindOn", "Choose today or a later date.")}
            disabled={mutation.pending}
            onChange={(changeEvent) => {
              setRemindOn(changeEvent.target.value);
              setInvalid(null);
            }}
          />
        )}

        <Select
          label={dated ? "About" : "Event"}
          value={event}
          options={[...REMINDER_EVENT_OPTIONS]}
          disabled={mutation.pending}
          onChange={(changeEvent) =>
            setEvent(changeEvent.target.value as PaymentReminderEvent)
          }
        />

        {!dated && (
          <Select
            label="Timing"
            value={timing}
            options={[...RELATIVE_TIMINGS]}
            disabled={mutation.pending}
            onChange={(changeEvent) =>
              setTiming(changeEvent.target.value as PaymentReminderTiming)
            }
          />
        )}

        {!dated && timing !== "on" && (
          <Input
            label="Days"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_DAYS}
            value={days}
            error={fieldError(
              "days",
              `Enter a whole number of days from 1 to ${MAX_DAYS}.`,
            )}
            disabled={mutation.pending}
            onChange={(changeEvent) => {
              setDays(changeEvent.target.value);
              setInvalid(null);
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
          loadingLabel="Adding reminder"
          leftIcon={<Icon icon={Add01Icon} size={17} />}
        >
          Add reminder
        </Button>
      </div>

      {dated && (
        <p id="reminder-date-hint" className={styles.hint}>
          {DATE_HINTS[event]}
        </p>
      )}
    </form>
  );
}
