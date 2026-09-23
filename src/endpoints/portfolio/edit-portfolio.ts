import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapPortfolioDetail,
} from "@/endpoints/portfolio/mapper";
import {
    getPortfolioErrorFields,
} from "@/endpoints/portfolio/mutation-errors";
import {
    toBackendPortfolioPayload,
} from "@/endpoints/portfolio/payload";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioMutationCsrf,
    PortfolioWriteResult,
} from "@/endpoints/portfolio/types";
import type {
    PortfolioWriteInput,
} from "@/types/portfolio/portfolio";

interface BackendResponse {
    data?: {
        portfolio?: unknown;
    };
    errors?: unknown;
}

export async function editPortfolio(
    portfolioId: number,
    input: PortfolioWriteInput,
    sessionId: string,
    csrf: PortfolioMutationCsrf,
    forwarded: Headers,
): Promise<PortfolioWriteResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/portfolio/update/${portfolioId}/`,
            {
                method: "PATCH",
                forwarded,
                headers:
                    portfolioRequestHeaders(
                        sessionId,
                        csrf,
                    ),
                body:
                    toBackendPortfolioPayload(
                        input,
                    ),
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            data: null,
            fields:
                getPortfolioErrorFields(
                    result.data,
                ),
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
        data: portfolio,
        fields: [],
    };
}