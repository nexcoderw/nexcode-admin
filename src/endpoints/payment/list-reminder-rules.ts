import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapReminderRuleList,
} from "@/endpoints/payment/reminder-mapper";
import type {
    PaymentReminderRuleListData,
    PaymentReminderRuleListQuery,
} from "@/types/payment/reminder";

export function listPaymentReminderRules(
    sessionId: string,
    forwarded: Headers,
    query:
        PaymentReminderRuleListQuery = {},
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
        "is_enabled",
        query.isEnabled,
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
        PaymentReminderRuleListData
    >({
        path:
            "/api/admin/payment/"
            + "reminder/rule/list/"
            + suffix,

        sessionId,
        forwarded,

        mapData:
            mapReminderRuleList,
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
