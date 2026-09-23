import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapPortfolioDocument,
} from "@/endpoints/portfolio/mapper";
import {
    getPortfolioDocumentErrorFields,
} from "@/endpoints/portfolio/mutation-errors";
import {
    toBackendDocumentPayload,
} from "@/endpoints/portfolio/payload";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioDocumentResult,
    PortfolioMutationCsrf,
} from "@/endpoints/portfolio/types";
import type {
    PortfolioDocumentInput,
} from "@/types/portfolio/portfolio";

interface BackendResponse {
    data?: {
        document?: unknown;
    };
    errors?: unknown;
}

export async function editPortfolioDocument(
    documentId: number,
    input: PortfolioDocumentInput,
    sessionId: string,
    csrf: PortfolioMutationCsrf,
    forwarded: Headers,
): Promise<PortfolioDocumentResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/portfolio/document/update/${documentId}/`,
            {
                method: "PATCH",
                forwarded,
                headers:
                    portfolioRequestHeaders(
                        sessionId,
                        csrf,
                    ),
                body:
                    toBackendDocumentPayload(
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
                getPortfolioDocumentErrorFields(
                    result.data,
                ),
        };
    }

    const document =
        mapPortfolioDocument(
            result.data?.data
                ?.document,
        );

    return {
        ok: Boolean(document),
        status: document
            ? result.status
            : 502,
        data: document,
        fields: [],
    };
}