import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapPortfolioImage,
} from "@/endpoints/portfolio/mapper";
import {
    getPortfolioImageErrorFields,
} from "@/endpoints/portfolio/mutation-errors";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioImageResult,
    PortfolioMutationCsrf,
} from "@/endpoints/portfolio/types";

interface BackendResponse {
    data?: {
        image?: unknown;
    };
    errors?: unknown;
}

export async function editPortfolioImage(
    imageId: number,
    formData: FormData,
    sessionId: string,
    csrf: PortfolioMutationCsrf,
    forwarded: Headers,
): Promise<PortfolioImageResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/portfolio/image/update/${imageId}/`,
            {
                method: "PATCH",
                forwarded,
                headers:
                    portfolioRequestHeaders(
                        sessionId,
                        csrf,
                    ),
                formData,
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            data: null,
            fields:
                getPortfolioImageErrorFields(
                    result.data,
                ),
        };
    }

    const image =
        mapPortfolioImage(
            result.data?.data?.image,
        );

    return {
        ok: Boolean(image),
        status: image
            ? result.status
            : 502,
        data: image,
        fields: [],
    };
}