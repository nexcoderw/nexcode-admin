import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
    isNumber,
} from "@/endpoints/payment/mapper-utils";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

export interface ReadAllNotificationsResult {
    updatedCount: number;
}

export function readAllPaymentNotifications(
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        ReadAllNotificationsResult
    >({
        path:
            "/api/admin/payment/reminder/"
            + "notification/read-all/",

        method: "POST",
        body: {},

        sessionId,
        csrf,
        forwarded,

        mapData(value) {
            const item = asRecord(
                value,
            );

            return (
                item &&
                isNumber(
                    item.updated_count,
                )
            )
                ? {
                    updatedCount:
                        item.updated_count,
                }
                : null;
        },
    });
}
