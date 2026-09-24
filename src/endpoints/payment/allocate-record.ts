import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    toBackendAllocationPayload,
} from "@/endpoints/payment/payload";
import {
    mapPaymentRecord,
} from "@/endpoints/payment/record-mapper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentAllocationRequest,
    PaymentRecord,
} from "@/types/payment/record";

export function allocatePaymentRecord(
    paymentId: number,
    input:
        PaymentAllocationRequest,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentRecord
    >({
        path:
            `/api/admin/payment/record/allocate/${paymentId}/`,

        method: "POST",

        body:
            toBackendAllocationPayload(
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
