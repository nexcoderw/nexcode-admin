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
    toBackendMilestonePayload,
} from "@/endpoints/payment/payload";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    MilestoneConfirmationInput,
    PaymentInstallment,
} from "@/types/payment/installment";

export function confirmPaymentMilestone(
    installmentId: number,
    input:
        MilestoneConfirmationInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentInstallment
    >({
        path:
            `/api/admin/payment/installment/confirm-milestone/${installmentId}/`,

        method: "POST",

        body:
            toBackendMilestonePayload(
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
