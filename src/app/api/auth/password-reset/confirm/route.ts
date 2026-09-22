import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    MESSAGE_KEYS,
} from "@/constants/shared/messages";
import {
    confirmAdminPasswordReset,
} from "@/endpoints/auth/confirm-password-reset";
import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import {
    ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
    clearPasswordResetSession,
} from "@/utils/auth/password-reset-session";
import {
    clearAdminSessionCookies,
} from "@/utils/auth/session";

interface ConfirmPayload {
    password?: unknown;
    confirmPassword?: unknown;
}

export async function POST(
    request: NextRequest,
) {
    const resetToken =
        request.cookies.get(
            ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
        )?.value;

    if (!resetToken) {
        return failureResponse(
            MESSAGE_KEYS.auth
                .passwordResetSessionInvalid,
            400,
        );
    }

    const body =
        await parseConfirmation(
            request,
        );

    if (!body) {
        return failureResponse(
            MESSAGE_KEYS.auth.invalidRequest,
            400,
        );
    }

    const forwarded = new Headers(
        request.headers,
    );

    try {
        const csrf =
            await getAdminCsrf(
                forwarded,
            );

        if (!csrf) {
            return serviceUnavailableResponse();
        }

        const result =
            await confirmAdminPasswordReset(
                {
                    resetToken,
                    password:
                        body.password,
                    confirmPassword:
                        body.confirmPassword,
                },
                forwarded,
                csrf,
            );

        if (!result.ok) {
            if (result.status === 400) {
                return failureResponse(
                    MESSAGE_KEYS.auth
                        .passwordResetRejected,
                    400,
                );
            }

            return serviceUnavailableResponse();
        }

        const response =
            NextResponse.json(
                {
                    success: true,
                },
                {
                    status: 200,
                },
            );

        clearPasswordResetSession(
            response,
        );

        clearAdminSessionCookies(
            response,
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

async function parseConfirmation(
    request: Request,
) {
    let payload: ConfirmPayload;

    try {
        payload =
            (await request.json()) as ConfirmPayload;
    } catch {
        return null;
    }

    if (
        typeof payload?.password !==
        "string" ||
        typeof payload.confirmPassword !==
        "string"
    ) {
        return null;
    }

    if (
        !payload.password ||
        !payload.confirmPassword
    ) {
        return null;
    }

    if (
        payload.password !==
        payload.confirmPassword
    ) {
        return null;
    }

    return {
        password:
            payload.password,

        confirmPassword:
            payload.confirmPassword,
    };
}

function failureResponse(
    messageKey: string,
    status: number,
) {
    const response =
        NextResponse.json(
            {
                success: false,
                messageKey,
            },
            {
                status,
            },
        );

    response.headers.set(
        "Cache-Control",
        "no-store",
    );

    return response;
}

function serviceUnavailableResponse() {
    return failureResponse(
        MESSAGE_KEYS.common
            .serviceUnavailable,
        503,
    );
}