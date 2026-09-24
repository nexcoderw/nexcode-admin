import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
    mapPortfolioSummary,
} from "@/endpoints/payment/summary-mapper";
import type {
    PortfolioFinancialSummary,
} from "@/types/payment/summary";

export function getPortfolioFinancialSummary(
    portfolioId: number,
    sessionId: string,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PortfolioFinancialSummary
    >({
        path:
            `/api/admin/payment/summary/portfolio/${portfolioId}/`,

        sessionId,
        forwarded,

        mapData(value) {
            return mapPortfolioSummary(
                asRecord(value)
                    ?.summary,
            );
        },
    });
}
