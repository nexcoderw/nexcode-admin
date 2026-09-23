import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    editPortfolioRepository,
} from "@/endpoints/portfolio/edit-portfolio-repository";
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
        repositoryId: string;
    }>;
}

export async function PATCH(
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

    const { repositoryId: rawId } =
        await context.params;

    const repositoryId =
        parsePortfolioResourceId(
            rawId,
        );

    if (!repositoryId) {
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
                    editPortfolioRepository(
                        repositoryId,
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
            return portfolioNotFound(
                "repository",
            );
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
            NextResponse.json({
                success: true,
                data: {
                    repository:
                        result.data,
                },
            }),
        );
    } catch {
        return portfolioServiceUnavailable();
    }
}
