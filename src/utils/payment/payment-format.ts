import {
  REMINDER_CHANNEL_OPTIONS,
  REMINDER_EVENT_OPTIONS,
} from "@/constants/payment/payment-options";
import type {
  PaymentAgreementStatus,
  PaymentAgreementType,
} from "@/types/payment/agreement";
import type {
  PaymentReminderChannel,
  PaymentReminderRule,
} from "@/types/payment/reminder";
import type {
  PaymentCurrency,
} from "@/types/payment/shared";

export function formatPaymentMoney(
  amount: string,
  currency: PaymentCurrency,
) {
  const parsed =
    Number(amount);

  if (!Number.isFinite(parsed)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat(
    "en-RW",
    {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: 2,
    },
  ).format(parsed);
}

export function formatPaymentDate(
  value: string | null,
) {
  if (!value) {
    return "Not set";
  }

  const date =
    /^\d{4}-\d{2}-\d{2}$/
      .test(value)
      ? new Date(
          `${value}T00:00:00Z`,
        )
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
}

export function agreementTypeLabel(
  value: PaymentAgreementType,
) {
  return {
    project:
      "Project",
    maintenance:
      "Maintenance",
    custom:
      "Custom",
  }[value];
}

export function agreementStatusLabel(
  value:
    PaymentAgreementStatus,
) {
  return {
    draft:
      "Draft",
    active:
      "Active",
    completed:
      "Completed",
    cancelled:
      "Cancelled",
  }[value];
}

export function installmentTypeLabel(
  value: string,
) {
  return {
    down_payment:
      "Down payment",
    installment:
      "Installment",
    final_payment:
      "Final payment",
    milestone:
      "Milestone",
    maintenance:
      "Maintenance",
    custom:
      "Custom",
  }[value] ?? value;
}

export function reminderChannelLabel(
  channel: PaymentReminderChannel,
) {
  return (
    REMINDER_CHANNEL_OPTIONS.find(
      (option) => option.value === channel,
    )?.label ?? channel
  );
}

/**
 * A reminder rule in words, e.g. "7 days before installment due".
 */
export function describeReminderRule(
  rule: PaymentReminderRule,
) {
  const event = (
    REMINDER_EVENT_OPTIONS.find(
      (option) => option.value === rule.event,
    )?.label ?? rule.event
  ).toLowerCase();

  if (rule.timing === "on") {
    return `On the day of ${event}`;
  }

  const days =
    `${rule.days} day${rule.days === 1 ? "" : "s"}`;

  return `${days} ${rule.timing} ${event}`;
}
