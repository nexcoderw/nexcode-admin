import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    toBackendReminderPayload,
} from "@/endpoints/payment/payload";
import {
    mapReminderRule,
} from "@/endpoints/payment/reminder-mapper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentReminderRule,
    PaymentReminderRuleInput,
} from "@/types/payment/reminder";

export function addPaymentReminderRule(
    agreementId: number,
    input:
        PaymentReminderRuleInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentReminderRule
    >({
        path:
            `/api/admin/payment/reminder/rule/add/${agreementId}/`,

        method: "POST",

        body:
            toBackendReminderPayload(
                input,
            ),

        sessionId,
        csrf,
        forwarded,

        mapData(value) {
            return mapReminderRule(
                asRecord(value)
                    ?.rule,
            );
        },
    });
}
