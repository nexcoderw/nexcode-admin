import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    mapReminderRule,
} from "@/endpoints/payment/reminder-mapper";
import type {
    PaymentReminderRule,
} from "@/types/payment/reminder";

export function getPaymentReminderRule(
    ruleId: number,
    sessionId: string,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentReminderRule
    >({
        path:
            `/api/admin/payment/reminder/rule/detail/${ruleId}/`,

        sessionId,
        forwarded,

        mapData(value) {
            return mapReminderRule(
                asRecord(value)
                    ?.rule,
            );
        },
    });
}
