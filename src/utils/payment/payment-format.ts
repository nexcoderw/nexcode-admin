import type {
  PaymentAgreementStatus,
  PaymentAgreementType,
} from "@/types/payment/agreement";
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
