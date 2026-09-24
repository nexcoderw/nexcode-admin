import "server-only";

const PAYMENT_FIELDS = {
    portfolio_id:
        "portfolioId",

    title:
        "title",

    reference:
        "reference",

    agreement_type:
        "agreementType",

    currency:
        "currency",

    total_amount:
        "totalAmount",

    agreement_date:
        "agreementDate",

    start_date:
        "startDate",

    end_date:
        "endDate",

    status:
        "status",

    notes:
        "notes",

    sequence:
        "sequence",

    installment_type:
        "installmentType",

    amount:
        "amount",

    due_type:
        "dueType",

    expected_due_date:
        "expectedDueDate",

    due_date:
        "dueDate",

    milestone:
        "milestone",

    grace_period_days:
        "gracePeriodDays",

    payment_method:
        "paymentMethod",

    paid_at:
        "paidAt",

    allocations:
        "allocations",

    reason:
        "reason",

    event:
        "event",

    timing:
        "timing",

    days:
        "days",

    remind_on:
        "remindOn",

    channel:
        "channel",

    is_enabled:
        "isEnabled",

    monthly_amount:
        "monthlyAmount",

    months:
        "months",

    first_due_date:
        "firstDueDate",

    down_payment_amount:
        "downPaymentAmount",

    down_payment_date:
        "downPaymentDate",

    installment_count:
        "installmentCount",

    first_installment_date:
        "firstInstallmentDate",

    __all__:
        "__all__",
} as const;

export function getPaymentErrorFields(
    value: unknown,
) {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return [];
    }

    const errors =
        (
            value as {
                errors?: unknown;
            }
        ).errors;

    if (
        !errors ||
        typeof errors !== "object" ||
        Array.isArray(errors)
    ) {
        return [];
    }

    return Object.keys(
        errors,
    )
        .filter(
            (
                key,
            ): key is keyof typeof PAYMENT_FIELDS =>
                key in PAYMENT_FIELDS,
        )
        .map(
            (key) =>
                PAYMENT_FIELDS[
                    key
                ],
        );
}
