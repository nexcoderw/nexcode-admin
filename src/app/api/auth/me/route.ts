import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    MESSAGE_KEYS,
} from "@/constants/shared/messages";
import {
    getAdminMe,
} from "@/endpoints/auth/me";
import {
    ADMIN_SESSION_COOKIE_NAME,
    clearAdminSessionCookies,
} from "@/utils/auth/session";

export async function GET(
    request: NextRequest,
) {
    const sessionId =
        request.cookies.get(
            ADMIN_SESSION_COOKIE_NAME,
        )?.value;

    if (!sessionId) {
        return authenticationRequiredResponse();
    }

    try {
        const result = await getAdminMe(
            sessionId,
            new Headers(request.headers),
        );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            const response =
                authenticationRequiredResponse();

            clearAdminSessionCookies(
                response,
            );

            return response;
        }

        if (!result.ok || !result.admin) {
            return serviceUnavailableResponse();
        }

        const response =
            NextResponse.json(
                {
                    success: true,
                    data: {
                        admin: result.admin,
                    },
                },
                {
                    status: 200,
                },
            );

        response.headers.set(
            "Cache-Control",
            "no-store",
        );

        return response;
    } catch {
        return serviceUnavailableResponse();
    }
}

function authenticationRequiredResponse() {
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

    response.headers.set(
        "Cache-Control",
        "no-store",
    );

    return response;
}

function serviceUnavailableResponse() {
    const response =
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
        );

    response.headers.set(
        "Cache-Control",
        "no-store",
    );

    return response;
}