export const PAYMENT_CURRENCIES = [
    "RWF",
    "USD",
    "EUR",
    "GBP",
] as const;

export const PAYMENT_AGREEMENT_TYPES = [
    "project",
    "maintenance",
    "custom",
] as const;

export const PAYMENT_AGREEMENT_STATUSES = [
    "draft",
    "active",
    "completed",
    "cancelled",
] as const;

export const PAYMENT_AGREEMENT_ORDERINGS = [
    "title",
    "-title",
    "total_amount",
    "-total_amount",
    "agreement_date",
    "-agreement_date",
    "start_date",
    "-start_date",
    "created_at",
    "-created_at",
    "updated_at",
    "-updated_at",
] as const;

export const PAYMENT_INSTALLMENT_TYPES = [
    "down_payment",
    "installment",
    "final_payment",
    "milestone",
    "maintenance",
    "custom",
] as const;

export const PAYMENT_DUE_TYPES = [
    "fixed_date",
    "milestone",
] as const;

export const PAYMENT_METHODS = [
    "bank_transfer",
    "mobile_money",
    "cash",
    "card",
    "cheque",
    "other",
] as const;

export const PAYMENT_RECORD_STATUSES = [
    "posted",
    "voided",
] as const;

export const PAYMENT_RECORD_ORDERINGS = [
    "amount",
    "-amount",
    "paid_at",
    "-paid_at",
    "created_at",
    "-created_at",
] as const;

export const PAYMENT_REMINDER_EVENTS = [
    "installment_due",
    "milestone_expected",
    "agreement_expiry",
] as const;

export const PAYMENT_REMINDER_TIMINGS = [
    "before",
    "on",
    "after",
    "date",
] as const;

export const PAYMENT_REMINDER_CHANNELS = [
    "in_app",
    "email",
] as const;

export const PAYMENT_NOTIFICATION_STATUSES = [
    "pending",
    "sent",
    "failed",
] as const;

export const PAYMENT_MAX_PAGE_SIZE = 100;