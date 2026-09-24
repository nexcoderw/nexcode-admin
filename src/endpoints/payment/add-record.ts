import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    toBackendRecordPayload,
} from "@/endpoints/payment/payload";
import {
    mapPaymentRecord,
} from "@/endpoints/payment/record-mapper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentRecord,
    PaymentRecordInput,
} from "@/types/payment/record";

export function addPaymentRecord(
    agreementId: number,
    input: PaymentRecordInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentRecord
    >({
        path:
            `/api/admin/payment/record/add/${agreementId}/`,

        method: "POST",

        body:
            toBackendRecordPayload(
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
