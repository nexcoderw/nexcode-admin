import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    editPortfolioImage,
} from "@/endpoints/portfolio/edit-portfolio-image";
import {
    parsePortfolioResourceId,
} from "@/utils/portfolio/portfolio-id";
import {
    sanitizePortfolioImageFormData,
} from "@/utils/portfolio/portfolio-image-form-data";
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
        imageId: string;
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

    const { imageId: rawId } =
        await context.params;

    const imageId =
        parsePortfolioResourceId(
            rawId,
        );

    if (!imageId) {
        return portfolioInvalidRequest();
    }

    let submitted: FormData;

    try {
        submitted =
            await request.formData();
    } catch {
        return portfolioInvalidRequest();
    }

    const formData =
        sanitizePortfolioImageFormData(
            submitted,
        );

    if (!formData) {
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
                    editPortfolioImage(
                        imageId,
                        formData,
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
                "image",
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
                    image:
                        result.data,
                },
            }),
        );
    } catch {
        return portfolioServiceUnavailable();
    }
}
