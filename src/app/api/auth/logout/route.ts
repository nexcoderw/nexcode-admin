import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    MESSAGE_KEYS,
} from "@/constants/shared/messages";
import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import {
    logoutAdmin,
    type AdminLogoutCsrf,
} from "@/endpoints/auth/logout";
import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
    clearAdminSessionCookies,
} from "@/utils/auth/session";

export async function POST(
    request: NextRequest,
) {
    const sessionId =
        request.cookies.get(
            ADMIN_SESSION_COOKIE_NAME,
        )?.value;

    const storedCsrf =
        request.cookies.get(
            ADMIN_CSRF_COOKIE_NAME,
        )?.value;

    if (!sessionId) {
        return signedOutResponse();
    }

    const forwarded = new Headers(
        request.headers,
    );

    try {
        let csrf: AdminLogoutCsrf | null =
            storedCsrf
                ? {
                    cookie: storedCsrf,
                    token: storedCsrf,
                }
                : null;

        if (!csrf) {
            csrf = await getAdminCsrf(
                forwarded,
                sessionId,
            );
        }

        if (!csrf) {
            return revocationFailedResponse();
        }

        let result = await logoutAdmin(
            sessionId,
            csrf,
            forwarded,
        );

        if (result.status === 403) {
            const refreshedCsrf =
                await getAdminCsrf(
                    forwarded,
                    sessionId,
                );

            if (refreshedCsrf) {
                result = await logoutAdmin(
                    sessionId,
                    refreshedCsrf,
                    forwarded,
                );
            }
        }

        if (!result.ok) {
            console.error(
                "Administrator session revocation failed.",
                {
                    status: result.status,
                },
            );

            return revocationFailedResponse();
        }

        return signedOutResponse();
    } catch (error) {
        console.error(
            "Administrator logout request failed.",
            {
                error:
                    error instanceof Error
                        ? error.name
                        : "UnknownError",
            },
        );

        return revocationFailedResponse();
    }
}

function signedOutResponse() {
    const response = NextResponse.json(
        {
            success: true,
            signedOut: true,
        },
        {
            status: 200,
        },
    );

    clearAdminSessionCookies(
        response,
    );

    response.headers.set(
        "Cache-Control",
        "no-store",
    );

    return response;
}

function revocationFailedResponse() {
    const response = NextResponse.json(
        {
            success: false,
            signedOut: true,
            messageKey:
                MESSAGE_KEYS.common
                    .serviceUnavailable,
        },
        {
            status: 503,
        },
    );

    clearAdminSessionCookies(
        response,
    );

    response.headers.set(
        "Cache-Control",
        "no-store",
    );

    return response;
}