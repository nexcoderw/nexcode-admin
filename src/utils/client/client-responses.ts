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


export function clientAuthenticationRequired() {
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
                    MESSAGE_KEYS.client
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
                    MESSAGE_KEYS.client
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
                    MESSAGE_KEYS.common
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