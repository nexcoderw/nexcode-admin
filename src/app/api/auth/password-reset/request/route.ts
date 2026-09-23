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
    requestAdminPasswordReset,
} from "@/endpoints/auth/request-password-reset";
import {
    clearPasswordResetToken,
    setPasswordResetChallenge,
} from "@/utils/auth/password-reset-session";

interface RequestPayload {
    email?: unknown;
}

export async function POST(
    request: NextRequest,
) {
    const body =
        await parseRequest(request);

    if (!body) {
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
            await requestAdminPasswordReset(
                body,
                forwarded,
                csrf,
            );

        if (!result.ok) {
            if (result.status === 400) {
                return failureResponse(
                    AUTH_MESSAGE_KEYS.invalidRequest,
                    400,
                );
            }

            return serviceUnavailableResponse();
        }

        const challengeId =
            result.data?.data
                ?.challenge_id;

        if (
            typeof challengeId !==
            "string" ||
            !challengeId
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

        setPasswordResetChallenge(
            response,
            challengeId,
        );

        clearPasswordResetToken(
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

async function parseRequest(
    request: Request,
) {
    let payload: RequestPayload;

    try {
        payload =
            (await request.json()) as RequestPayload;
    } catch {
        return null;
    }

    if (
        typeof payload?.email !==
        "string"
    ) {
        return null;
    }

    const email = payload.email
        .trim()
        .toLowerCase();

    if (!email) {
        return null;
    }

    return {
        email,
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
        COMMON_MESSAGE_KEYS
            .serviceUnavailable,
        503,
    );
}