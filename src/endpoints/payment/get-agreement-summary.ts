import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    mapAgreementSummary,
} from "@/endpoints/payment/summary-mapper";
import type {
    AgreementFinancialSummary,
} from "@/types/payment/summary";

export function getAgreementFinancialSummary(
    agreementId: number,
    sessionId: string,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        AgreementFinancialSummary
    >({
        path:
            `/api/admin/payment/summary/agreement/${agreementId}/`,

        sessionId,
        forwarded,

        mapData(value) {
            return mapAgreementSummary(
                asRecord(value)
                    ?.summary,
            );
        },
    });
}