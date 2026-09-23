import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    deletePortfolio,
} from "@/endpoints/portfolio/delete-portfolio";
import {
    parsePortfolioResourceId,
} from "@/utils/portfolio/portfolio-id";
import {
    runPortfolioMutation,
} from "@/utils/portfolio/portfolio-mutation";
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

export async function DELETE(
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
                    deletePortfolio(
                        portfolioId,
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
            result.status === 404
        ) {
            return portfolioNotFound();
        }

        if (!result.ok) {
            return portfolioServiceUnavailable();
        }

        return noStore(
            NextResponse.json({
                success: true,
            }),
        );
    } catch {
        return portfolioServiceUnavailable();
    }
}