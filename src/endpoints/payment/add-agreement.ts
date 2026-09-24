import "server-only";

import {
    mapPaymentAgreement,
} from "@/endpoints/payment/agreement-mapper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    toBackendAgreementPayload,
} from "@/endpoints/payment/payload";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    PaymentAgreement,
    PaymentAgreementInput,
} from "@/types/payment/agreement";

export function addPaymentAgreement(
    input: PaymentAgreementInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentAgreement
    >({
        path:
            "/api/admin/payment/"
            + "agreement/add/",

        method: "POST",

        body:
            toBackendAgreementPayload(
                input,
            ),

        sessionId,
        csrf,
        forwarded,

        mapData(value) {
            return mapPaymentAgreement(
                asRecord(value)
                    ?.agreement,
            );
        },
    });
}