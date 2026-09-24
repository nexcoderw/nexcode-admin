import {
    PAYMENT_AGREEMENT_ORDERINGS,
    PAYMENT_AGREEMENT_STATUSES,
    PAYMENT_AGREEMENT_TYPES,
    PAYMENT_CURRENCIES,
    PAYMENT_MAX_PAGE_SIZE,
} from "@/constants/payment/payment-query";
import type {
    PaymentAgreementListQuery,
} from "@/types/payment/agreement";

export function parseAgreementQuery(
    params: URLSearchParams,
): PaymentAgreementListQuery | null {
    const result:
        PaymentAgreementListQuery = {};

    const search =
        params.get(
            "search",
        )?.trim();

    if (search) {
        result.search = search;
    }

    const ordering =
        params.get(
            "ordering",
        );

    if (ordering) {
        if (
            !PAYMENT_AGREEMENT_ORDERINGS
                .includes(
                    ordering as never,
                )
        ) {
            return null;
        }

        result.ordering =
            ordering as (
                PaymentAgreementListQuery[
                    "ordering"
                ]
            );
    }

    const portfolioId =
        positiveInt(
            params.get(
                "portfolioId",
            ),
        );

    if (
        portfolioId
        === false
    ) {
        return null;
    }

    if (portfolioId) {
        result.portfolioId =
            portfolioId;
    }

    const agreementType =
        params.get(
            "agreementType",
        );

    if (agreementType) {
        if (
            !PAYMENT_AGREEMENT_TYPES
                .includes(
                    agreementType as never,
                )
        ) {
            return null;
        }

        result.agreementType =
            agreementType as never;
    }

    const status =
        params.get(
            "status",
        );

    if (status) {
        if (
            !PAYMENT_AGREEMENT_STATUSES
                .includes(
                    status as never,
                )
        ) {
            return null;
        }

        result.status =
            status as never;
    }

    const currency =
        params.get(
            "currency",
        );

    if (currency) {
        if (
            !PAYMENT_CURRENCIES
                .includes(
                    currency as never,
                )
        ) {
            return null;
        }

        result.currency =
            currency as never;
    }

    if (
        !pagination(
            params,
            result,
        )
    ) {
        return null;
    }

    return result;
}

function pagination(
    params: URLSearchParams,
    output:
        PaymentAgreementListQuery,
) {
    const page =
        positiveInt(
            params.get("page"),
        );

    const pageSize =
        positiveInt(
            params.get(
                "pageSize",
            ),
        );

    if (
        page === false ||
        pageSize === false ||
        (
            pageSize &&
            pageSize >
            PAYMENT_MAX_PAGE_SIZE
        )
    ) {
        return false;
    }

    if (page) {
        output.page = page;
    }

    if (pageSize) {
        output.pageSize =
            pageSize;
    }

    return true;
}

function positiveInt(
    value: string | null,
) {
    if (!value) {
        return undefined;
    }

    const parsed =
        Number(value);

    return (
        Number.isInteger(parsed) &&
        parsed > 0
    )
        ? parsed
        : false;
}
