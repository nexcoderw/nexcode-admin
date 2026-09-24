import "server-only";

import {
    NextResponse,
} from "next/server";

import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import { CONTACT_MESSAGE_KEYS } from "@/constants/messages/contact-messages";
import {
    clearAdminSessionCookies,
} from "@/utils/auth/session";


export function contactAuthenticationRequired() {
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


export function contactInvalidRequest(
    fields: string[] = [],
) {
    return noStore(
        NextResponse.json(
            {
                success: false,

                messageKey:
                    CONTACT_MESSAGE_KEYS
                        .invalidRequest,

                fields,
            },
            {
                status: 400,
            },
        ),
    );
}


export function contactNotFound() {
    return noStore(
        NextResponse.json(
            {
                success: false,

                messageKey:
                    CONTACT_MESSAGE_KEYS
                        .notFound,
            },
            {
                status: 404,
            },
        ),
    );
}


export function contactEmailNotSent() {
    return noStore(
        NextResponse.json(
            {
                success: false,

                messageKey:
                    CONTACT_MESSAGE_KEYS
                        .emailNotSent,
            },
            {
                status: 502,
            },
        ),
    );
}


export function contactServiceUnavailable() {
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
