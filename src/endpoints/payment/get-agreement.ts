import "server-only";

import {
    mapPaymentAgreement,
} from "@/endpoints/payment/agreement-mapper";
import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import type {
    PaymentAgreement,
} from "@/types/payment/agreement";

export function getPaymentAgreement(
    agreementId: number,
    sessionId: string,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentAgreement
    >({
        path:
            `/api/admin/payment/agreement/detail/${agreementId}/`,

        sessionId,
        forwarded,

        mapData(value) {
            return mapPaymentAgreement(
                asRecord(value)
                    ?.agreement,
            );
        },
    });
}
