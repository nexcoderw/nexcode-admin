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
    toBackendWaiverPayload,
} from "@/endpoints/payment/payload";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    InstallmentWaiverInput,
    PaymentInstallment,
} from "@/types/payment/installment";

export function waivePaymentInstallment(
    installmentId: number,
    input:
        InstallmentWaiverInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentInstallment
    >({
        path:
            `/api/admin/payment/installment/waive/${installmentId}/`,

        method: "POST",

        body:
            toBackendWaiverPayload(
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