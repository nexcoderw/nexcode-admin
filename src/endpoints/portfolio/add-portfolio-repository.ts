import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapPortfolioRepository,
} from "@/endpoints/portfolio/mapper";
import {
    getPortfolioRepositoryErrorFields,
} from "@/endpoints/portfolio/mutation-errors";
import {
    toBackendRepositoryPayload,
} from "@/endpoints/portfolio/payload";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioMutationCsrf,
    PortfolioRepositoryResult,
} from "@/endpoints/portfolio/types";
import type {
    PortfolioRepositoryInput,
} from "@/types/portfolio/portfolio";

interface BackendResponse {
    data?: {
        repository?: unknown;
    };
    errors?: unknown;
}

export async function addPortfolioRepository(
    portfolioId: number,
    input: PortfolioRepositoryInput,
    sessionId: string,
    csrf: PortfolioMutationCsrf,
    forwarded: Headers,
): Promise<PortfolioRepositoryResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/portfolio/repository/add/${portfolioId}/`,
            {
                method: "POST",
                forwarded,
                headers:
                    portfolioRequestHeaders(
                        sessionId,
                        csrf,
                    ),
                body:
                    toBackendRepositoryPayload(
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
                getPortfolioRepositoryErrorFields(
                    result.data,
                ),
        };
    }

    const repository =
        mapPortfolioRepository(
            result.data?.data
                ?.repository,
        );

    return {
        ok: Boolean(repository),
        status: repository
            ? result.status
            : 502,
        data: repository,
        fields: [],
    };
}
