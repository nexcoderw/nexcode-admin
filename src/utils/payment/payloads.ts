import {
    PAYMENT_AGREEMENT_STATUSES,
    PAYMENT_AGREEMENT_TYPES,
    PAYMENT_CURRENCIES,
    PAYMENT_DUE_TYPES,
    PAYMENT_INSTALLMENT_TYPES,
} from "@/constants/payment/payment-query";
import type {
    InstallmentWaiverInput,
    MilestoneConfirmationInput,
    PaymentAgreementInput,
    PaymentInstallmentInput,
    PaymentVoidInput,
} from "@/types/payment";
import {
    copyChoice,
    copyNumber,
    copyString,
    record,
} from "@/utils/payment/payload-helpers";

export function sanitizeAgreementPayload(
    value: unknown,
): PaymentAgreementInput | null {
    const raw = record(value);

    if (!raw) {
        return null;
    }

    const output:
        PaymentAgreementInput = {};

    if (
        !copyNumber(
            raw,
            output,
            "portfolioId",
        ) ||
        !copyString(
            raw,
            output,
            "title",
        ) ||
        !copyString(
            raw,
            output,
            "reference",
        ) ||
        !copyChoice(
            raw,
            output,
            "agreementType",
            PAYMENT_AGREEMENT_TYPES,
        ) ||
        !copyChoice(
            raw,
            output,
            "currency",
            PAYMENT_CURRENCIES,
        ) ||
        !copyString(
            raw,
            output,
            "totalAmount",
        ) ||
        !copyString(
            raw,
            output,
            "agreementDate",
        ) ||
        !copyString(
            raw,
            output,
            "startDate",
        ) ||
        !copyString(
            raw,
            output,
            "endDate",
        ) ||
        !copyChoice(
            raw,
            output,
            "status",
            PAYMENT_AGREEMENT_STATUSES,
        ) ||
        !copyString(
            raw,
            output,
            "notes",
        )
    ) {
        return null;
    }

    return output;
}

export function sanitizeInstallmentPayload(
    value: unknown,
): PaymentInstallmentInput | null {
    const raw = record(value);

    if (!raw) {
        return null;
    }

    const output:
        PaymentInstallmentInput = {};

    if (
        !copyNumber(
            raw,
            output,
            "sequence",
        ) ||
        !copyString(
            raw,
            output,
            "title",
        ) ||
        !copyChoice(
            raw,
            output,
            "installmentType",
            PAYMENT_INSTALLMENT_TYPES,
        ) ||
        !copyString(
            raw,
            output,
            "amount",
        ) ||
        !copyChoice(
            raw,
            output,
            "dueType",
            PAYMENT_DUE_TYPES,
        ) ||
        !copyString(
            raw,
            output,
            "expectedDueDate",
        ) ||
        !copyString(
            raw,
            output,
            "dueDate",
        ) ||
        !copyString(
            raw,
            output,
            "milestone",
        ) ||
        !copyNumber(
            raw,
            output,
            "gracePeriodDays",
        ) ||
        !copyString(
            raw,
            output,
            "notes",
        )
    ) {
        return null;
    }

    return output;
}

export function sanitizeReasonPayload(
    value: unknown,
): PaymentVoidInput | InstallmentWaiverInput | null {
    const raw = record(value);

    return (
        raw &&
        typeof raw.reason
        === "string"
    )
        ? {
            reason:
                raw.reason,
        }
        : null;
}

export function sanitizeMilestonePayload(
    value: unknown,
): MilestoneConfirmationInput | null {
    const raw = record(value);

    return (
        raw &&
        typeof raw.dueDate
        === "string"
    )
        ? {
            dueDate:
                raw.dueDate,
        }
        : null;
}
