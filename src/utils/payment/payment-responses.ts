import "server-only";

import {
    NextResponse,
} from "next/server";

import {
    AUTH_MESSAGE_KEYS,
} from "@/constants/messages/auth-messages";
import {
    COMMON_MESSAGE_KEYS,
} from "@/constants/messages/common-messages";
import {
    PAYMENT_MESSAGE_KEYS,
} from "@/constants/messages/payment-messages";
import {
    clearAdminSessionCookies,
} from "@/utils/auth/session";

export type PaymentNotFoundKind =
    | "agreement"
    | "installment"
    | "record"
    | "reminderRule"
    | "notification"
    | "portfolio";

export function paymentAuthenticationRequired() {
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

export function paymentInvalidRequest(
    fields: string[] = [],
) {
    return noStore(
        NextResponse.json(
            {
                success: false,

                messageKey:
                    PAYMENT_MESSAGE_KEYS
                        .invalidRequest,

                fields,
            },
            {
                status: 400,
            },
        ),
    );
}

export function paymentNotFound(
    kind:
        PaymentNotFoundKind,
) {
    const keys = {
        agreement:
            PAYMENT_MESSAGE_KEYS
                .agreementNotFound,

        installment:
            PAYMENT_MESSAGE_KEYS
                .installmentNotFound,

        record:
            PAYMENT_MESSAGE_KEYS
                .recordNotFound,

        reminderRule:
            PAYMENT_MESSAGE_KEYS
                .reminderRuleNotFound,

        notification:
            PAYMENT_MESSAGE_KEYS
                .notificationNotFound,

        portfolio:
            PAYMENT_MESSAGE_KEYS
                .portfolioNotFound,
    } as const;

    return noStore(
        NextResponse.json(
            {
                success: false,
                messageKey:
                    keys[kind],
            },
            {
                status: 404,
            },
        ),
    );
}

export function paymentServiceUnavailable() {
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
