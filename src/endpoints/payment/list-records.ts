import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapRecordListData,
} from "@/endpoints/payment/record-mapper";
import type {
    PaymentRecordListData,
    PaymentRecordListQuery,
} from "@/types/payment/record";

export function listPaymentRecords(
    sessionId: string,
    forwarded: Headers,
    query:
        PaymentRecordListQuery = {},
) {
    const params =
        new URLSearchParams();

    set(
        params,
        "ordering",
        query.ordering,
    );
    set(
        params,
        "agreement_id",
        query.agreementId,
    );
    set(
        params,
        "portfolio_id",
        query.portfolioId,
    );
    set(
        params,
        "status",
        query.status,
    );
    set(
        params,
        "payment_method",
        query.paymentMethod,
    );
    set(
        params,
        "paid_from",
        query.paidFrom,
    );
    set(
        params,
        "paid_to",
        query.paidTo,
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
        PaymentRecordListData
    >({
        path:
            "/api/admin/payment/"
            + "record/list/"
            + suffix,

        sessionId,
        forwarded,

        mapData:
            mapRecordListData,
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
