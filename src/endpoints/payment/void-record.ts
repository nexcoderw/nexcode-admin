import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    toBackendVoidPayload,
} from "@/endpoints/payment/payload";
import {
    mapPaymentRecord,
} from "@/endpoints/payment/record-mapper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentRecord,
    PaymentVoidInput,
} from "@/types/payment/record";

export function voidPaymentRecord(
    paymentId: number,
    input: PaymentVoidInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentRecord
    >({
        path:
            `/api/admin/payment/record/void/${paymentId}/`,

        method: "POST",

        body:
            toBackendVoidPayload(
                input,
            ),

        sessionId,
        csrf,
        forwarded,

        mapData(value) {
            return mapPaymentRecord(
                asRecord(value)
                    ?.payment,
            );
        },
    });
}
