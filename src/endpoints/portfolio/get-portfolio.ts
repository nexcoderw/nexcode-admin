import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapPortfolioDetail,
} from "@/endpoints/portfolio/mapper";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioDetailResult,
} from "@/endpoints/portfolio/types";

interface BackendResponse {
    status: "success";
    data: {
        portfolio: unknown;
    };
}

export async function getPortfolio(
    portfolioId: number,
    sessionId: string,
    forwarded: Headers,
): Promise<PortfolioDetailResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/portfolio/detail/${portfolioId}/`,
            {
                method: "GET",
                forwarded,
                headers:
                    portfolioRequestHeaders(
                        sessionId,
                    ),
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            portfolio: null,
        };
    }

    const portfolio =
        mapPortfolioDetail(
            result.data?.data
                ?.portfolio,
        );

    return {
        ok: Boolean(portfolio),
        status: portfolio
            ? result.status
            : 502,
        portfolio,
    };
}