import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

export function deletePaymentInstallment(
    installmentId: number,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<never>({
        path:
            `/api/admin/payment/installment/delete/${installmentId}/`,

        method: "DELETE",
        sessionId,
        csrf,
        forwarded,
        allowEmpty: true,
    });
}