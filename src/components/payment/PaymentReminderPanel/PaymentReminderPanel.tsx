"use client";

import {
  Delete02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import {
  useState,
} from "react";

import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Badge,
} from "@/components/ui/Badge/Badge";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  Input,
} from "@/components/ui/Input/Input";
import {
  Select,
} from "@/components/ui/Select/Select";
import {
  REMINDER_CHANNEL_OPTIONS,
  REMINDER_EVENT_OPTIONS,
  REMINDER_TIMING_OPTIONS,
} from "@/constants/payment/payment-options";
import {
  PAYMENT_API_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  usePaymentMutation,
} from "@/hooks/payment/use-payment-mutation";
import type {
  PaymentReminderChannel,
  PaymentReminderEvent,
  PaymentReminderRule,
  PaymentReminderTiming,
} from "@/types/payment/reminder";

import styles from "./PaymentReminderPanel.module.css";

interface PaymentReminderPanelProps {
  agreementId: number;
  rules:
    PaymentReminderRule[];
}

export function PaymentReminderPanel({
  agreementId,
  rules,
}: PaymentReminderPanelProps) {
  const mutation =
    usePaymentMutation();

  const [event, setEvent] =
    useState<PaymentReminderEvent>(
      "installment_due",
    );

  const [timing, setTiming] =
    useState<PaymentReminderTiming>(
      "before",
    );

  const [days, setDays] =
    useState("7");

  const [channel, setChannel] =
    useState<PaymentReminderChannel>(
      "in_app",
    );

  async function addRule() {
    await mutation.mutate(
      PAYMENT_API_ROUTES
        .reminderRuleAdd(
          agreementId,
        ),
      {
        method: "POST",

        failureMessage:
          "The reminder rule could not be created.",

        body: {
          event,
          timing,

          days:
            timing === "on"
              ? 0
              : Number(days),

          channel,
          isEnabled: true,
        },
      },
    );
  }

  async function removeRule(
    ruleId: number,
  ) {
    await mutation.mutate(
      PAYMENT_API_ROUTES
        .reminderRuleDelete(
          ruleId,
        ),
      {
        method: "DELETE",

        failureMessage:
          "The reminder rule could not be deleted.",
      },
    );
  }

  return (
    <section
      className={
        styles.panel
      }
    >
      <header>
        <div>
          <span>
            Automation
          </span>

          <h2>
            Reminder rules
          </h2>
        </div>

        <Badge
          size="sm"
          variant="neutral"
        >
          {rules.length}
        </Badge>
      </header>

      {mutation.error && (
        <Alert
          variant="error"
          title="Reminder action failed"
        >
          {mutation.error}
        </Alert>
      )}

      <form
        className={
          styles.form
        }
        onSubmit={(
          submitEvent,
        ) => {
          submitEvent
            .preventDefault();

          void addRule();
        }}
      >
        <Select
          label="Event"
          value={event}
          options={[
            ...REMINDER_EVENT_OPTIONS,
          ]}
          onChange={(
            changeEvent,
          ) =>
            setEvent(
              changeEvent.target
                .value as
                PaymentReminderEvent,
            )
          }
        />

        <Select
          label="Timing"
          value={timing}
          options={[
            ...REMINDER_TIMING_OPTIONS,
          ]}
          onChange={(
            changeEvent,
          ) =>
            setTiming(
              changeEvent.target
                .value as
                PaymentReminderTiming,
            )
          }
        />

        {timing !== "on" && (
          <Input
            label="Days"
            type="number"
            min={1}
            max={3650}
            value={days}
            onChange={(
              changeEvent,
            ) =>
              setDays(
                changeEvent.target
                  .value,
              )
            }
          />
        )}

        <Select
          label="Channel"
          value={channel}
          options={[
            ...REMINDER_CHANNEL_OPTIONS,
          ]}
          onChange={(
            changeEvent,
          ) =>
            setChannel(
              changeEvent.target
                .value as
                PaymentReminderChannel,
            )
          }
        />

        <Button
          type="submit"
          isLoading={
            mutation.pending
          }
          leftIcon={
            <Icon
              icon={
                Mail01Icon
              }
              size={17}
            />
          }
        >
          Add rule
        </Button>
      </form>

      <div
        className={
          styles.rules
        }
      >
        {rules.length === 0 ? (
          <p
            className={
              styles.empty
            }
          >
            No reminder rules have been configured.
          </p>
        ) : (
          rules.map(
            (rule) => (
              <article
                key={
                  rule.id
                }
                className={
                  styles.rule
                }
              >
                <div>
                  <strong>
                    {rule.event
                      .replaceAll(
                        "_",
                        " ",
                      )}
                  </strong>

                  <span>
                    {rule.timing ===
                    "on"
                      ? "On target date"
                      : `${rule.days} day${rule.days === 1 ? "" : "s"} ${rule.timing}`}
                    {" · "}
                    {rule.channel
                      .replaceAll(
                        "_",
                        " ",
                      )}
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  iconOnly
                  leftIcon={
                    <Icon
                      icon={
                        Delete02Icon
                      }
                      size={16}
                    />
                  }
                  aria-label="Delete reminder rule"
                  onClick={() =>
                    void removeRule(
                      rule.id,
                    )
                  }
                >
                  Delete reminder
                </Button>
              </article>
            ),
          )
        )}
      </div>
    </section>
  );
}