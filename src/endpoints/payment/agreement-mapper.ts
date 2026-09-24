import "server-only";

import {
    PAYMENT_AGREEMENT_STATUSES,
    PAYMENT_AGREEMENT_TYPES,
    PAYMENT_CURRENCIES,
} from "@/constants/payment/payment-query";
import {
    asRecord,
    isNullableString,
    isNumber,
    isOneOf,
    isString,
    mapPaymentPagination,
} from "@/endpoints/payment/mapper-utils";
import type {
    PaymentAgreement,
    PaymentAgreementListData,
} from "@/types/payment/agreement";

export function mapPaymentAgreement(
    value: unknown,
): PaymentAgreement | null {
    const item = asRecord(
        value,
    );

    const portfolio = asRecord(
        item?.portfolio,
    );

    if (
        !item ||
        !portfolio ||
        !isNumber(item.id) ||
        !isNumber(portfolio.id) ||
        !isString(portfolio.name) ||
        !isString(portfolio.slug) ||
        !isString(item.title) ||
        !isNullableString(
            item.reference,
        ) ||
        !isOneOf(
            item.agreement_type,
            PAYMENT_AGREEMENT_TYPES,
        ) ||
        !isOneOf(
            item.currency,
            PAYMENT_CURRENCIES,
        ) ||
        !isString(
            item.total_amount,
        ) ||
        !isString(
            item.agreement_date,
        ) ||
        !isString(
            item.start_date,
        ) ||
        !isNullableString(
            item.end_date,
        ) ||
        !isOneOf(
            item.status,
            PAYMENT_AGREEMENT_STATUSES,
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

        portfolio: {
            id: portfolio.id,
            name: portfolio.name,
            slug: portfolio.slug,
        },

        title: item.title,
        reference:
            item.reference,

        agreementType:
            item.agreement_type,

        currency:
            item.currency,

        totalAmount:
            item.total_amount,

        agreementDate:
            item.agreement_date,

        startDate:
            item.start_date,

        endDate:
            item.end_date,

        status:
            item.status,

        notes: item.notes,

        createdAt:
            item.created_at,

        updatedAt:
            item.updated_at,
    };
}

export function mapAgreementListData(
    value: unknown,
): PaymentAgreementListData | null {
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
        PaymentAgreement[] = [];

    for (
        const raw
        of data.items
    ) {
        const agreement =
            mapPaymentAgreement(
                raw,
            );

        if (!agreement) {
            return null;
        }

        items.push(
            agreement,
        );
    }

    const pagination =
        mapPaymentPagination(
            data.pagination,
        );

    if (!pagination) {
        return null;
    }

    return {
        items,
        pagination,
    };
}
