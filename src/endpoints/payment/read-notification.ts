import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    mapNotification,
} from "@/endpoints/payment/reminder-mapper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentNotification,
} from "@/types/payment/reminder";

export function readPaymentNotification(
    notificationId: number,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentNotification
    >({
        path:
            `/api/admin/payment/reminder/notification/read/${notificationId}/`,

        method: "POST",
        body: {},

        sessionId,
        csrf,
        forwarded,

        mapData(value) {
            return mapNotification(
                asRecord(value)
                    ?.notification,
            );
        },
    });
}
