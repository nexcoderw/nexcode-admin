import type {
    NextRequest,
} from "next/server";

import {
    getPortfolioFinancialSummary,
} from "@/endpoints/payment/get-portfolio-summary";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params: Promise<{
        portfolioId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext,
) {
    const params =
        await context.params;

    const portfolioId =
        parsePaymentId(
            params.portfolioId,
        );

    if (!portfolioId) {
        return paymentInvalidRequest();
    }

    return handlePaymentRead(
        request,

        (
            sessionId,
            forwarded,
        ) =>
            getPortfolioFinancialSummary(
                portfolioId,
                sessionId,
                forwarded,
            ),

        "agreement",
    );
}
