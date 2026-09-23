import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioDeleteResult,
    PortfolioMutationCsrf,
} from "@/endpoints/portfolio/types";

export async function deletePortfolioImage(
    imageId: number,
    sessionId: string,
    csrf: PortfolioMutationCsrf,
    forwarded: Headers,
): Promise<PortfolioDeleteResult> {
    const result =
        await backendRequest<null>(
            `/api/admin/portfolio/image/delete/${imageId}/`,
            {
                method: "DELETE",
                forwarded,
                headers:
                    portfolioRequestHeaders(
                        sessionId,
                        csrf,
                    ),
            },
        );

    return {
        ok: result.ok,
        status: result.status,
    };
}