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

export function teamAuthenticationRequired() {
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

    noStore(response);

    return response;
}

export function teamNotFound() {
    const response =
        NextResponse.json(
            {
                success: false,
                messageKey:
                    MESSAGE_KEYS.team
                        .notFound,
            },
            {
                status: 404,
            },
        );

    noStore(response);

    return response;
}

export function teamInvalidRequest(
    fields: string[] = [],
) {
    const response =
        NextResponse.json(
            {
                success: false,
                messageKey:
                    MESSAGE_KEYS.team
                        .invalidRequest,
                fields,
            },
            {
                status: 400,
            },
        );

    noStore(response);

    return response;
}

export function teamServiceUnavailable() {
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

    noStore(response);

    return response;
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