import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapInstallmentList,
} from "@/endpoints/payment/installment-mapper";
import type {
    PaymentInstallment,
} from "@/types/payment/installment";

export function listPaymentInstallments(
    agreementId: number,
    sessionId: string,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentInstallment[]
    >({
        path:
            `/api/admin/payment/installment/list/${agreementId}/`,

        sessionId,
        forwarded,

        mapData:
            mapInstallmentList,
    });
}