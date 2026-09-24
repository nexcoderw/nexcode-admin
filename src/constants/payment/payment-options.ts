export const AGREEMENT_TYPE_OPTIONS = [
  {
    value: "project",
    label: "Project",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
  {
    value: "custom",
    label: "Custom",
  },
] as const;

export const AGREEMENT_STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
] as const;

export const CURRENCY_OPTIONS = [
  {
    value: "RWF",
    label: "RWF",
  },
  {
    value: "USD",
    label: "USD",
  },
  {
    value: "EUR",
    label: "EUR",
  },
  {
    value: "GBP",
    label: "GBP",
  },
] as const;

export const AGREEMENT_ORDER_OPTIONS = [
  {
    value: "-created_at",
    label: "Newest first",
  },
  {
    value: "created_at",
    label: "Oldest first",
  },
  {
    value: "title",
    label: "Title A–Z",
  },
  {
    value: "-title",
    label: "Title Z–A",
  },
  {
    value: "-total_amount",
    label: "Highest value",
  },
  {
    value: "total_amount",
    label: "Lowest value",
  },
  {
    value: "start_date",
    label: "Start date",
  },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  {
    value: "bank_transfer",
    label: "Bank transfer",
  },
  {
    value: "mobile_money",
    label: "Mobile money",
  },
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "card",
    label: "Card",
  },
  {
    value: "cheque",
    label: "Cheque",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export const REMINDER_EVENT_OPTIONS = [
  {
    value: "installment_due",
    label: "Installment due",
  },
  {
    value: "milestone_expected",
    label: "Milestone expected",
  },
  {
    value: "agreement_expiry",
    label: "Agreement expiry",
  },
] as const;

export const REMINDER_TIMING_OPTIONS = [
  {
    value: "before",
    label: "Before",
  },
  {
    value: "on",
    label: "On the date",
  },
  {
    value: "after",
    label: "After",
  },
] as const;

export const REMINDER_CHANNEL_OPTIONS = [
  {
    value: "in_app",
    label: "In-app",
  },
  {
    value: "email",
    label: "Email",
  },
] as const;
