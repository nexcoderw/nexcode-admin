import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapInstallment,
} from "@/endpoints/payment/installment-mapper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    toBackendInstallmentPayload,
} from "@/endpoints/payment/payload";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentInstallment,
    PaymentInstallmentInput,
} from "@/types/payment/installment";

export function editPaymentInstallment(
    installmentId: number,
    input: PaymentInstallmentInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentInstallment
    >({
        path:
            `/api/admin/payment/installment/update/${installmentId}/`,

        method: "PATCH",

        body:
            toBackendInstallmentPayload(
                input,
            ),

        sessionId,
        csrf,
        forwarded,

        mapData(value) {
            return mapInstallment(
                asRecord(value)
                    ?.installment,
            );
        },
    });
}