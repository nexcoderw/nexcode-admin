import {
    PAYMENT_METHODS,
    PAYMENT_RECORD_ORDERINGS,
    PAYMENT_RECORD_STATUSES,
} from "@/constants/payment/payment-query";
import type {
    PaymentRecordListQuery,
} from "@/types/payment/record";
import {
    hasInvalid,
    INVALID,
    readChoice,
    readDate,
    readPage,
    readPositiveInt,
} from "@/utils/payment/query";

export function parseRecordQuery(
    params: URLSearchParams,
): PaymentRecordListQuery | null {
    const values = {
        ordering:
            readChoice(
                params,
                "ordering",
                PAYMENT_RECORD_ORDERINGS,
            ),
        agreementId:
            readPositiveInt(
                params,
                "agreementId",
            ),
        portfolioId:
            readPositiveInt(
                params,
                "portfolioId",
            ),
        status:
            readChoice(
                params,
                "status",
                PAYMENT_RECORD_STATUSES,
            ),
        paymentMethod:
            readChoice(
                params,
                "paymentMethod",
                PAYMENT_METHODS,
            ),
        paidFrom:
            readDate(
                params,
                "paidFrom",
            ),
        paidTo:
            readDate(
                params,
                "paidTo",
            ),
    };

    const page =
        readPage(params);

    if (
        page === INVALID ||
        hasInvalid(
            Object.values(values),
        )
    ) {
        return null;
    }

    return {
        ...(values as PaymentRecordListQuery),
        ...page,
    };
}
