import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    listPortfolios,
} from "@/endpoints/portfolio/list-portfolios";
import {
    parsePortfolioListQuery,
} from "@/utils/portfolio/portfolio-list-query";
import {
    noStore,
    portfolioAuthenticationRequired,
    portfolioInvalidRequest,
    portfolioServiceUnavailable,
} from "@/utils/portfolio/portfolio-responses";
import {
    getPortfolioRequestSession,
} from "@/utils/portfolio/portfolio-session";

export async function GET(
    request: NextRequest,
) {
    const session =
        getPortfolioRequestSession(
            request,
        );

    if (!session) {
        return portfolioAuthenticationRequired();
    }

    const query =
        parsePortfolioListQuery(
            request.nextUrl
                .searchParams,
        );

    if (!query) {
        return portfolioInvalidRequest();
    }

    try {
        const result =
            await listPortfolios(
                session.sessionId,
                new Headers(
                    request.headers,
                ),
                query,
            );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return portfolioAuthenticationRequired();
        }

        if (
            result.status === 400
        ) {
            return portfolioInvalidRequest();
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
                data: result.data,
            }),
        );
    } catch {
        return portfolioServiceUnavailable();
    }
}