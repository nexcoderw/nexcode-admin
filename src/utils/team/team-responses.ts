import "server-only";

import {
    NextResponse,
} from "next/server";

import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import { TEAM_MESSAGE_KEYS } from "@/constants/messages/team-messages";
import {
    clearAdminSessionCookies,
} from "@/utils/auth/session";

export function teamAuthenticationRequired() {
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

    noStore(response);

    return response;
}

export function teamNotFound() {
    const response =
        NextResponse.json(
            {
                success: false,
                messageKey:
                    TEAM_MESSAGE_KEYS
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
                    TEAM_MESSAGE_KEYS
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
                    COMMON_MESSAGE_KEYS
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