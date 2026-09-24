import "server-only";

import {
    PAYMENT_CURRENCIES,
    PAYMENT_METHODS,
    PAYMENT_RECORD_STATUSES,
} from "@/constants/payment/payment-query";
import {
    asRecord,
    isNullableNumber,
    isNullableString,
    isNumber,
    isOneOf,
    isString,
    mapPaymentPagination,
} from "@/endpoints/payment/mapper-utils";
import type {
    PaymentAllocation,
    PaymentRecord,
    PaymentRecordListData,
    PaymentRecordedBy,
} from "@/types/payment/record";

export function mapPaymentRecord(
    value: unknown,
): PaymentRecord | null {
    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isNumber(item.id) ||
        !isNumber(
            item.agreement_id,
        ) ||
        !isString(item.amount) ||
        !isOneOf(
            item.currency,
            PAYMENT_CURRENCIES,
        ) ||
        !isString(item.paid_at) ||
        !isOneOf(
            item.payment_method,
            PAYMENT_METHODS,
        ) ||
        !isNullableString(
            item.reference,
        ) ||
        !isString(item.notes) ||
        !isOneOf(
            item.status,
            PAYMENT_RECORD_STATUSES,
        ) ||
        !isNullableString(
            item.voided_at,
        ) ||
        !isNullableString(
            item.void_reason,
        ) ||
        !Array.isArray(
            item.allocations,
        ) ||
        !isString(
            item.created_at,
        ) ||
        !isString(
            item.updated_at,
        )
    ) {
        return null;
    }

    const recordedBy =
        mapRecordedBy(
            item.recorded_by,
        );

    if (
        item.recorded_by !== null &&
        !recordedBy
    ) {
        return null;
    }

    const allocations:
        PaymentAllocation[] = [];

    for (
        const raw
        of item.allocations
    ) {
        const allocation =
            mapAllocation(
                raw,
            );

        if (!allocation) {
            return null;
        }

        allocations.push(
            allocation,
        );
    }

    return {
        id: item.id,

        agreementId:
            item.agreement_id,

        amount: item.amount,

        currency:
            item.currency,

        paidAt:
            item.paid_at,

        paymentMethod:
            item.payment_method,

        reference:
            item.reference,

        notes: item.notes,

        status:
            item.status,

        voidedAt:
            item.voided_at,

        voidReason:
            item.void_reason,

        recordedBy,
        allocations,

        createdAt:
            item.created_at,

        updatedAt:
            item.updated_at,
    };
}

export function mapRecordListData(
    value: unknown,
): PaymentRecordListData | null {
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
        PaymentRecord[] = [];

    for (
        const raw
        of data.items
    ) {
        const payment =
            mapPaymentRecord(
                raw,
            );

        if (!payment) {
            return null;
        }

        items.push(
            payment,
        );
    }

    const pagination =
        mapPaymentPagination(
            data.pagination,
        );

    return pagination
        ? {
            items,
            pagination,
        }
        : null;
}

function mapAllocation(
    value: unknown,
): PaymentAllocation | null {
    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isNumber(item.id) ||
        !isNumber(
            item.installment_id,
        ) ||
        !isString(
            item.installment_title,
        ) ||
        !isString(item.amount)
    ) {
        return null;
    }

    return {
        id: item.id,

        installmentId:
            item.installment_id,

        installmentTitle:
            item.installment_title,

        amount: item.amount,
    };
}

function mapRecordedBy(
    value: unknown,
): PaymentRecordedBy | null {
    if (value === null) {
        return null;
    }

    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isNullableNumber(
            item.id,
        ) ||
        item.id === null ||
        !isString(item.name)
    ) {
        return null;
    }

    return {
        id: item.id,
        name: item.name,
    };
}