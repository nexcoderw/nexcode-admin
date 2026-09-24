import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapInstallmentList,
} from "@/endpoints/payment/installment-mapper";
import {
    toBackendContractSchedulePayload,
} from "@/endpoints/payment/payload";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    ContractScheduleInput,
} from "@/types/payment/schedule";
import type {
    PaymentInstallment,
} from "@/types/payment/installment";

export function generateContractSchedule(
    agreementId: number,
    input: ContractScheduleInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentInstallment[]
    >({
        path:
            `/api/admin/payment/schedule/contract/${agreementId}/`,

        method: "POST",

        body:
            toBackendContractSchedulePayload(
                input,
            ),

        sessionId,
        csrf,
        forwarded,

        mapData:
            mapInstallmentList,
    });
}
