import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    addPortfolio,
} from "@/endpoints/portfolio/add-portfolio";
import {
    sanitizePortfolioPayload,
} from "@/utils/portfolio/portfolio-json-payload";
import {
    runPortfolioMutation,
} from "@/utils/portfolio/portfolio-mutation";
import {
    noStore,
    portfolioAuthenticationRequired,
    portfolioInvalidRequest,
    portfolioServiceUnavailable,
} from "@/utils/portfolio/portfolio-responses";
import {
    getPortfolioRequestSession,
} from "@/utils/portfolio/portfolio-session";

export async function POST(
    request: NextRequest,
) {
    const session =
        getPortfolioRequestSession(
            request,
        );

    if (!session) {
        return portfolioAuthenticationRequired();
    }

    let raw: unknown;

    try {
        raw =
            await request.json();
    } catch {
        return portfolioInvalidRequest();
    }

    const input =
        sanitizePortfolioPayload(
            raw,
        );

    if (!input) {
        return portfolioInvalidRequest();
    }

    const forwarded =
        new Headers(
            request.headers,
        );

    try {
        const result =
            await runPortfolioMutation(
                session.sessionId,
                session.csrfToken,
                forwarded,
                (csrf) =>
                    addPortfolio(
                        input,
                        session.sessionId,
                        csrf,
                        forwarded,
                    ),
            );

        if (!result) {
            return portfolioServiceUnavailable();
        }

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return portfolioAuthenticationRequired();
        }

        if (
            result.status === 400
        ) {
            return portfolioInvalidRequest(
                result.fields,
            );
        }

        if (
            !result.ok ||
            !result.data
        ) {
            return portfolioServiceUnavailable();
        }

        return noStore(
            NextResponse.json(
                {
                    success: true,
                    data: {
                        portfolio:
                            result.data,
                    },
                },
                {
                    status: 201,
                },
            ),
        );
    } catch {
        return portfolioServiceUnavailable();
    }
}