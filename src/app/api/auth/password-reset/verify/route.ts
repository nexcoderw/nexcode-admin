import {
    type NextRequest,
    NextResponse,
} from "next/server";

import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import {
    verifyAdminPasswordReset,
} from "@/endpoints/auth/verify-password-reset";
import {
    ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
    clearPasswordResetChallenge,
    setPasswordResetToken,
} from "@/utils/auth/password-reset-session";

interface VerifyPayload {
    code?: unknown;
}

export async function POST(
    request: NextRequest,
) {
    const challengeId =
        request.cookies.get(
            ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
        )?.value;

    if (!challengeId) {
        return failureResponse(
            AUTH_MESSAGE_KEYS
                .passwordResetSessionInvalid,
            400,
        );
    }

    const code =
        await parseCode(request);

    if (!code) {
        return failureResponse(
            AUTH_MESSAGE_KEYS.invalidRequest,
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
            await verifyAdminPasswordReset(
                {
                    challengeId,
                    code,
                },
                forwarded,
                csrf,
            );

        if (!result.ok) {
            if (result.status === 400) {
                return failureResponse(
                    AUTH_MESSAGE_KEYS
                        .passwordResetVerificationInvalid,
                    400,
                );
            }

            return serviceUnavailableResponse();
        }

        const resetToken =
            result.data?.data
                ?.reset_token;

        if (
            typeof resetToken !==
            "string" ||
            !resetToken
        ) {
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

        setPasswordResetToken(
            response,
            resetToken,
        );

        clearPasswordResetChallenge(
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

async function parseCode(
    request: Request,
) {
    let payload: VerifyPayload;

    try {
        payload =
            (await request.json()) as VerifyPayload;
    } catch {
        return null;
    }

    if (
        typeof payload?.code !==
        "string"
    ) {
        return null;
    }

    const code =
        payload.code.trim();

    if (
        code.length !== 6 ||
        !/^\d{6}$/.test(code)
    ) {
        return null;
    }

    return code;
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
        COMMON_MESSAGE_KEYS
            .serviceUnavailable,
        503,
    );
}