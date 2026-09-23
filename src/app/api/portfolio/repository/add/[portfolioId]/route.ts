import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    addPortfolioRepository,
} from "@/endpoints/portfolio/add-portfolio-repository";
import {
    parsePortfolioResourceId,
} from "@/utils/portfolio/portfolio-id";
import {
    sanitizePortfolioRepositoryPayload,
} from "@/utils/portfolio/portfolio-json-payload";
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
        portfolioId: string;
    }>;
}

export async function POST(
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

    const { portfolioId: rawId } =
        await context.params;

    const portfolioId =
        parsePortfolioResourceId(
            rawId,
        );

    if (!portfolioId) {
        return portfolioInvalidRequest();
    }

    let raw: unknown;

    try {
        raw =
            await request.json();
    } catch {
        return portfolioInvalidRequest();
    }

    const input =
        sanitizePortfolioRepositoryPayload(
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
                    addPortfolioRepository(
                        portfolioId,
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
            result.status === 404
        ) {
            return portfolioNotFound();
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
                        repository:
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
