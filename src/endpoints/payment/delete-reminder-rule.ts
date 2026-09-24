import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

export function deletePaymentReminderRule(
    ruleId: number,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<never>({
        path:
            `/api/admin/payment/reminder/rule/delete/${ruleId}/`,

        method: "DELETE",

        sessionId,
        csrf,
        forwarded,
        allowEmpty: true,
    });
}
