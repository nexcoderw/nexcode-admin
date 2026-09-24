import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapNotificationList,
} from "@/endpoints/payment/reminder-mapper";
import type {
    PaymentNotificationListData,
    PaymentNotificationListQuery,
} from "@/types/payment/reminder";

export function listPaymentNotifications(
    sessionId: string,
    forwarded: Headers,
    query:
        PaymentNotificationListQuery = {},
) {
    const params =
        new URLSearchParams();

    set(
        params,
        "agreement_id",
        query.agreementId,
    );
    set(
        params,
        "event",
        query.event,
    );
    set(
        params,
        "channel",
        query.channel,
    );
    set(
        params,
        "status",
        query.status,
    );
    set(
        params,
        "unread",
        query.unread,
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
        PaymentNotificationListData
    >({
        path:
            "/api/admin/payment/"
            + "reminder/notification/list/"
            + suffix,

        sessionId,
        forwarded,

        mapData:
            mapNotificationList,
    });
}

function set(
    params: URLSearchParams,
    key: string,
    value:
        string | number | boolean | undefined,
) {
    if (value !== undefined) {
        params.set(
            key,
            String(value),
        );
    }
}
