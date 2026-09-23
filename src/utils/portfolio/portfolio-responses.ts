import "server-only";

import {
    NextResponse,
} from "next/server";

import {
    MESSAGE_KEYS,
} from "@/constants/shared/messages";
import {
    clearAdminSessionCookies,
} from "@/utils/auth/session";

export type PortfolioResource =
    | "portfolio"
    | "image"
    | "document"
    | "repository";

export function portfolioAuthenticationRequired() {
    const response =
        NextResponse.json(
            {
                success: false,
                messageKey:
                    MESSAGE_KEYS.auth
                        .authenticationRequired,
            },
            {
                status: 401,
            },
        );

    clearAdminSessionCookies(
        response,
    );

    return noStore(response);
}

export function portfolioInvalidRequest(
    fields: string[] = [],
) {
    return noStore(
        NextResponse.json(
            {
                success: false,
                messageKey:
                    MESSAGE_KEYS.portfolio
                        .invalidRequest,
                fields,
            },
            {
                status: 400,
            },
        ),
    );
}

export function portfolioNotFound(
    resource:
        PortfolioResource = "portfolio",
) {
    const keys = {
        portfolio:
            MESSAGE_KEYS.portfolio
                .notFound,
        image:
            MESSAGE_KEYS.portfolio
                .imageNotFound,
        document:
            MESSAGE_KEYS.portfolio
                .documentNotFound,
        repository:
            MESSAGE_KEYS.portfolio
                .repositoryNotFound,
    } as const;

    return noStore(
        NextResponse.json(
            {
                success: false,
                messageKey:
                    keys[resource],
            },
            {
                status: 404,
            },
        ),
    );
}

export function portfolioServiceUnavailable() {
    return noStore(
        NextResponse.json(
            {
                success: false,
                messageKey:
                    MESSAGE_KEYS.common
                        .serviceUnavailable,
            },
            {
                status: 503,
            },
        ),
    );
}

export function noStore(
    response: NextResponse,
) {
    response.headers.set(
        "Cache-Control",
        "no-store",
    );

    return response;
}