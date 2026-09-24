import "server-only";

import {
    mapAgreementListData,
} from "@/endpoints/payment/agreement-mapper";
import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import type {
    PaymentAgreementListData,
    PaymentAgreementListQuery,
} from "@/types/payment/agreement";

export function listPaymentAgreements(
    sessionId: string,
    forwarded: Headers,
    query:
        PaymentAgreementListQuery = {},
) {
    const params =
        new URLSearchParams();

    set(
        params,
        "search",
        query.search,
    );
    set(
        params,
        "ordering",
        query.ordering,
    );
    set(
        params,
        "portfolio_id",
        query.portfolioId,
    );
    set(
        params,
        "agreement_type",
        query.agreementType,
    );
    set(
        params,
        "status",
        query.status,
    );
    set(
        params,
        "currency",
        query.currency,
    );
    set(
        params,
        "page",
        query.page,
    );
    set(
        params,
        "page_size",
        query.pageSize,
    );

    const suffix =
        params.size
            ? `?${params}`
            : "";

    return requestPaymentEndpoint<
        PaymentAgreementListData
    >({
        path:
            "/api/admin/payment/"
            + "agreement/list/"
            + suffix,

        sessionId,
        forwarded,

        mapData:
            mapAgreementListData,
    });
}

function set(
    params: URLSearchParams,
    key: string,
    value:
        string | number | undefined,
) {
    if (value !== undefined) {
        params.set(
            key,
            String(value),
        );
    }
}