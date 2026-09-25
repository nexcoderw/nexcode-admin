import type {
    NextRequest,
} from "next/server";

import {
    getPortfolioPaymentStatement,
    getPortfolioPaymentStatementPdf,
} from "@/endpoints/payment/get-portfolio-statement";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    handlePaymentBinaryRead,
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params:
    Promise<{
        portfolioId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext,
) {
    const {
        portfolioId:
        rawId,
    } = await context.params;

    const portfolioId =
        parsePaymentId(
            rawId
        );

    if (!portfolioId) {
        return (
            paymentInvalidRequest()
        );
    }

    if (
        request.nextUrl
            .searchParams
            .get("format")
        === "pdf"
    ) {
        return (
            handlePaymentBinaryRead(
                request,
                (
                    sessionId,
                    forwarded,
                ) =>
                    getPortfolioPaymentStatementPdf(
                        portfolioId,
                        sessionId,
                        forwarded,
                    ),
                "portfolio",
                (
                    `portfolio-${portfolioId}`
                    + "-payment-statement.pdf"
                ),
            )
        );
    }

    return handlePaymentRead(
        request,
        (
            sessionId,
            forwarded,
        ) =>
            getPortfolioPaymentStatement(
                portfolioId,
                sessionId,
                forwarded,
            ),
        "portfolio",
    );
}