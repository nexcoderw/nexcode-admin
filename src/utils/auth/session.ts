import "server-only";

import type {
    NextResponse,
} from "next/server";

export const ADMIN_SESSION_COOKIE_NAME =
    "nexcode_admin_session";

export const ADMIN_CSRF_COOKIE_NAME =
    "nexcode_admin_csrf";

const REMEMBER_SESSION_SECONDS =
    7 * 24 * 60 * 60;

export interface AdminBackendSession {
    sessionId: string;
    csrfToken: string;
}

export function setAdminSessionCookies(
    response: NextResponse,
    session: AdminBackendSession,
    rememberMe: boolean,
) {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict" as const,
        path: "/",
        ...(rememberMe
            ? {
                maxAge:
                    REMEMBER_SESSION_SECONDS,
            }
            : {}),
    };

    response.cookies.set(
        ADMIN_SESSION_COOKIE_NAME,
        session.sessionId,
        options,
    );

    response.cookies.set(
        ADMIN_CSRF_COOKIE_NAME,
        session.csrfToken,
        options,
    );
}

export function clearAdminSessionCookies(
    response: NextResponse,
) {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict" as const,
        path: "/",
        maxAge: 0,
    };

    response.cookies.set(
        ADMIN_SESSION_COOKIE_NAME,
        "",
        options,
    );

    response.cookies.set(
        ADMIN_CSRF_COOKIE_NAME,
        "",
        options,
    );
}