import "server-only";

import {
    NextResponse,
} from "next/server";

import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import { PORTFOLIO_MESSAGE_KEYS } from "@/constants/messages/portfolio-messages";
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
                    AUTH_MESSAGE_KEYS
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
                    PORTFOLIO_MESSAGE_KEYS
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
            PORTFOLIO_MESSAGE_KEYS
                .notFound,
        image:
            PORTFOLIO_MESSAGE_KEYS
                .imageNotFound,
        document:
            PORTFOLIO_MESSAGE_KEYS
                .documentNotFound,
        repository:
            PORTFOLIO_MESSAGE_KEYS
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
                    COMMON_MESSAGE_KEYS
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