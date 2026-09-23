import {
    NextResponse,
} from "next/server";

import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import {
    loginAdmin,
    type AdminLoginRequest,
} from "@/endpoints/auth/login";
import type {
    BackendResult,
} from "@/endpoints/client";
import {
    getSetCookieValue,
} from "@/utils/auth/backend-cookies";
import {
    setAdminSessionCookies,
} from "@/utils/auth/session";

interface ClientLoginPayload {
    email?: unknown;
    password?: unknown;
    rememberMe?: unknown;
}

export async function POST(
    request: Request,
) {
    const body =
        await parseLoginRequest(request);

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
        const csrf = await getAdminCsrf(
            forwarded,
        );

        if (!csrf) {
            return serviceUnavailableResponse();
        }

        const result = await loginAdmin(
            body,
            forwarded,
            csrf,
        );

        if (!result.ok) {
            return mapLoginFailure(result);
        }

        const sessionId =
            getSetCookieValue(
                result.headers,
                "sessionid",
            );

        const csrfToken =
            getSetCookieValue(
                result.headers,
                "csrftoken",
            );

        if (!sessionId || !csrfToken) {
            return serviceUnavailableResponse();
        }

        const response = NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            },
        );

        response.headers.set(
            "Cache-Control",
            "no-store",
        );

        setAdminSessionCookies(
            response,
            {
                sessionId,
                csrfToken,
            },
            body.rememberMe,
        );

        return response;
    } catch {
        return serviceUnavailableResponse();
    }
}

async function parseLoginRequest(
    request: Request,
): Promise<AdminLoginRequest | null> {
    let payload: ClientLoginPayload;

    try {
        payload =
            (await request.json()) as ClientLoginPayload;
    } catch {
        return null;
    }

    if (
        !payload ||
        typeof payload !== "object"
    ) {
        return null;
    }

    if (
        typeof payload.email !== "string" ||
        typeof payload.password !== "string"
    ) {
        return null;
    }

    const rememberMe =
        payload.rememberMe ?? false;

    if (typeof rememberMe !== "boolean") {
        return null;
    }

    const email = payload.email
        .trim()
        .toLowerCase();

    if (!email || !payload.password) {
        return null;
    }

    return {
        email,
        password: payload.password,
        rememberMe,
    };
}

function mapLoginFailure(
    result: BackendResult<unknown>,
) {
    if (result.status === 401) {
        return failureResponse(
            AUTH_MESSAGE_KEYS.invalidCredentials,
            401,
        );
    }

    if (result.status === 429) {
        const response = failureResponse(
            AUTH_MESSAGE_KEYS.tooManyAttempts,
            429,
        );

        const retryAfter =
            result.headers.get("retry-after");

        if (
            retryAfter &&
            /^\d+$/.test(retryAfter)
        ) {
            response.headers.set(
                "Retry-After",
                retryAfter,
            );
        }

        return response;
    }

    if (result.status === 400) {
        return failureResponse(
            AUTH_MESSAGE_KEYS.invalidRequest,
            400,
        );
    }

    return serviceUnavailableResponse();
}

function failureResponse(
    messageKey: string,
    status: number,
) {
    const response = NextResponse.json(
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
        COMMON_MESSAGE_KEYS.serviceUnavailable,
        503,
    );
}