import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    getPortfolio,
} from "@/endpoints/portfolio/get-portfolio";
import {
    parsePortfolioResourceId,
} from "@/utils/portfolio/portfolio-id";
import {
    noStore,
    portfolioAuthenticationRequired,
    portfolioInvalidRequest,
    portfolioNotFound,
    portfolioServiceUnavailable,
} from "@/utils/portfolio/portfolio-responses";
import {
    getPortfolioRequestSession,
} from "@/utils/portfolio/portfolio-session";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext,
) {
    const session =
        getPortfolioRequestSession(
            request,
        );

    if (!session) {
        return portfolioAuthenticationRequired();
    }

    const { id } =
        await context.params;

    const portfolioId =
        parsePortfolioResourceId(
            id,
        );

    if (!portfolioId) {
        return portfolioInvalidRequest();
    }

    try {
        const result =
            await getPortfolio(
                portfolioId,
                session.sessionId,
                new Headers(
                    request.headers,
                ),
            );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return portfolioAuthenticationRequired();
        }

        if (
            result.status === 404
        ) {
            return portfolioNotFound();
        }

        if (
            !result.ok ||
            !result.portfolio
        ) {
            return portfolioServiceUnavailable();
        }

        return noStore(
            NextResponse.json({
                success: true,
                data: {
                    portfolio:
                        result.portfolio,
                },
            }),
        );
    } catch {
        return portfolioServiceUnavailable();
    }
}