import "server-only";

import type {
    NextRequest,
} from "next/server";

import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";

export interface PortfolioRequestSession {
    sessionId: string;
    csrfToken: string | null;
}

export function getPortfolioRequestSession(
    request: NextRequest,
): PortfolioRequestSession | null {
    const sessionId =
        request.cookies.get(
            ADMIN_SESSION_COOKIE_NAME,
        )?.value;

    if (!sessionId) {
        return null;
    }

    return {
        sessionId,
        csrfToken:
            request.cookies.get(
                ADMIN_CSRF_COOKIE_NAME,
            )?.value ?? null,
    };
}