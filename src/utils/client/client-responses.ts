import "server-only";

import {
    NextResponse,
} from "next/server";

import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { CLIENT_MESSAGE_KEYS } from "@/constants/messages/client-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import {
    clearAdminSessionCookies,
} from "@/utils/auth/session";


export function clientAuthenticationRequired() {
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

    return noStore(
        response,
    );
}


export function clientInvalidRequest(
    fields: string[] = [],
) {
    return noStore(
        NextResponse.json(
            {
                success: false,

                messageKey:
                    CLIENT_MESSAGE_KEYS
                        .invalidRequest,

                fields,
            },
            {
                status: 400,
            },
        ),
    );
}


export function clientNotFound() {
    return noStore(
        NextResponse.json(
            {
                success: false,

                messageKey:
                    CLIENT_MESSAGE_KEYS
                        .notFound,
            },
            {
                status: 404,
            },
        ),
    );
}


export function clientServiceUnavailable() {
    return noStore(
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
        ),
    );
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