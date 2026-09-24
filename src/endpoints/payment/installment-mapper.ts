import "server-only";

import {
    PAYMENT_DUE_TYPES,
    PAYMENT_INSTALLMENT_TYPES,
} from "@/constants/payment/payment-query";
import {
    asRecord,
    isBoolean,
    isNullableString,
    isNumber,
    isOneOf,
    isString,
} from "@/endpoints/payment/mapper-utils";
import type {
    InstallmentFinancialState,
    PaymentInstallment,
} from "@/types/payment/installment";

const PAYMENT_STATES = [
    "unpaid",
    "partial",
    "paid",
    "waived",
] as const;

const TIMING_STATES = [
    "upcoming",
    "due_today",
    "grace_period",
    "overdue",
    "awaiting_milestone",
    "settled",
] as const;

export function mapInstallment(
    value: unknown,
): PaymentInstallment | null {
    const item = asRecord(
        value,
    );

    const financial =
        mapFinancialState(
            item?.financial,
        );

    if (
        !item ||
        !financial ||
        !isNumber(item.id) ||
        !isNumber(
            item.agreement_id,
        ) ||
        !isNumber(item.sequence) ||
        !isString(item.title) ||
        !isOneOf(
            item.installment_type,
            PAYMENT_INSTALLMENT_TYPES,
        ) ||
        !isString(item.amount) ||
        !isOneOf(
            item.due_type,
            PAYMENT_DUE_TYPES,
        ) ||
        !isString(
            item.expected_due_date,
        ) ||
        !isNullableString(
            item.due_date,
        ) ||
        !isNullableString(
            item.milestone,
        ) ||
        !isNumber(
            item.grace_period_days,
        ) ||
        !isBoolean(
            item.is_waived,
        ) ||
        !isNullableString(
            item.waived_at,
        ) ||
        !isNullableString(
            item.waiver_reason,
        ) ||
        !isString(item.notes) ||
        !isString(
            item.created_at,
        ) ||
        !isString(
            item.updated_at,
        )
    ) {
        return null;
    }

    return {
        id: item.id,

        agreementId:
            item.agreement_id,

        sequence:
            item.sequence,

        title: item.title,

        installmentType:
            item.installment_type,

        amount: item.amount,

        dueType:
            item.due_type,

        expectedDueDate:
            item.expected_due_date,

        dueDate:
            item.due_date,

        milestone:
            item.milestone,

        gracePeriodDays:
            item.grace_period_days,

        isWaived:
            item.is_waived,

        waivedAt:
            item.waived_at,

        waiverReason:
            item.waiver_reason,

        notes: item.notes,
        financial,

        createdAt:
            item.created_at,

        updatedAt:
            item.updated_at,
    };
}

export function mapInstallmentList(
    value: unknown,
): PaymentInstallment[] | null {
    const data = asRecord(
        value,
    );

    if (
        !data ||
        !Array.isArray(
            data.items,
        )
    ) {
        return null;
    }

    const items:
        PaymentInstallment[] = [];

    for (
        const raw
        of data.items
    ) {
        const item =
            mapInstallment(
                raw,
            );

        if (!item) {
            return null;
        }

        items.push(item);
    }

    return items;
}

function mapFinancialState(
    value: unknown,
): InstallmentFinancialState | null {
    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isString(
            item.expected_amount,
        ) ||
        !isString(
            item.paid_amount,
        ) ||
        !isString(
            item.outstanding_amount,
        ) ||
        !isOneOf(
            item.payment_state,
            PAYMENT_STATES,
        ) ||
        !isOneOf(
            item.timing_state,
            TIMING_STATES,
        ) ||
        !isNullableString(
            item.effective_due_date,
        )
    ) {
        return null;
    }

    return {
        expectedAmount:
            item.expected_amount,

        paidAmount:
            item.paid_amount,

        outstandingAmount:
            item.outstanding_amount,

        paymentState:
            item.payment_state,

        timingState:
            item.timing_state,

        effectiveDueDate:
            item.effective_due_date,
    };
}