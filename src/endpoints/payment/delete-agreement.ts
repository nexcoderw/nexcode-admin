import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

export function deletePaymentAgreement(
    agreementId: number,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<never>({
        path:
            `/api/admin/payment/agreement/delete/${agreementId}/`,

        method: "DELETE",

        sessionId,
        csrf,
        forwarded,
        allowEmpty: true,
    });
}