import "server-only";

import {
    type NextRequest,
    NextResponse,
} from "next/server";

import type {
    PaymentEndpointResult,
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import {
    runPaymentMutation,
} from "@/utils/payment/payment-mutation";
import {
    paymentAuthenticationRequired,
    paymentInvalidRequest,
    paymentNotFound,
    paymentServiceUnavailable,
    noStore,
    type PaymentNotFoundKind,
} from "@/utils/payment/payment-responses";
import {
    getPaymentRequestSession,
} from "@/utils/payment/payment-session";

import type {
    BackendBinaryResult,
} from "@/endpoints/client";

export async function handlePaymentRead<T>(
    request: NextRequest,
    operation: (
        sessionId: string,
        forwarded: Headers,
    ) =>
        Promise<
            PaymentEndpointResult<T>
        >,
    notFound:
        PaymentNotFoundKind,
) {
    const session =
        getPaymentRequestSession(
            request,
        );

    if (!session) {
        return paymentAuthenticationRequired();
    }

    try {
        const result =
            await operation(
                session.sessionId,
                new Headers(
                    request.headers,
                ),
            );

        return resultResponse(
            result,
            notFound,
        );
    } catch {
        return paymentServiceUnavailable();
    }
}

export async function handlePaymentMutation<T>(
    request: NextRequest,
    operation: (
        sessionId: string,
        csrf: PaymentMutationCsrf,
        forwarded: Headers,
    ) =>
        Promise<
            PaymentEndpointResult<T>
        >,
    notFound:
        PaymentNotFoundKind,
) {
    const session =
        getPaymentRequestSession(
            request,
        );

    if (!session) {
        return paymentAuthenticationRequired();
    }

    const forwarded =
        new Headers(
            request.headers,
        );

    try {
        const result =
            await runPaymentMutation(
                session.sessionId,
                session.csrfToken,
                forwarded,

                (csrf) =>
                    operation(
                        session.sessionId,
                        csrf,
                        forwarded,
                    ),
            );

        if (!result) {
            return paymentServiceUnavailable();
        }

        return resultResponse(
            result,
            notFound,
        );
    } catch {
        return paymentServiceUnavailable();
    }
}

export async function readPaymentJson(
    request: NextRequest,
) {
    try {
        return {
            ok: true as const,
            value:
                await request.json() as unknown,
        };
    } catch {
        return {
            ok: false as const,
            value: null,
        };
    }
}

export async function handlePaymentBinaryRead(
    request: NextRequest,

    operation: (
        sessionId: string,
        forwarded: Headers,
    ) =>
        Promise<
            BackendBinaryResult
        >,

    notFound:
        PaymentNotFoundKind,

    filename: string,
) {
    const session =
        getPaymentRequestSession(
            request,
        );

    if (!session) {
        return (
            paymentAuthenticationRequired()
        );
    }

    try {
        const result =
            await operation(
                session.sessionId,
                new Headers(
                    request.headers,
                ),
            );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return (
                paymentAuthenticationRequired()
            );
        }

        if (
            result.status === 404
        ) {
            return paymentNotFound(
                notFound,
            );
        }

        if (
            !result.ok ||
            !result.body
        ) {
            return (
                paymentServiceUnavailable()
            );
        }

        return new Response(
            result.body,
            {
                status: 200,

                headers: {
                    "Content-Type":
                        result.contentType ??
                        "application/pdf",

                    "Content-Disposition":
                        `attachment; filename="${filename}"`,

                    "Cache-Control":
                        "no-store",

                    "X-Content-Type-Options":
                        "nosniff",
                },
            },
        );
    } catch {
        return (
            paymentServiceUnavailable()
        );
    }
}

function resultResponse<T>(
    result:
        PaymentEndpointResult<T>,
    notFound:
        PaymentNotFoundKind,
) {
    if (
        result.status === 401 ||
        result.status === 403
    ) {
        return paymentAuthenticationRequired();
    }

    if (
        result.status === 404
    ) {
        return paymentNotFound(
            notFound,
        );
    }

    if (
        result.status === 400
    ) {
        return paymentInvalidRequest(
            result.fields,
        );
    }

    if (!result.ok) {
        return paymentServiceUnavailable();
    }

    return noStore(
        NextResponse.json(
            result.data === null
                ? {
                    success: true,
                }
                : {
                    success: true,
                    data:
                        result.data,
                },
            {
                status:
                    result.status,
            },
        ),
    );
}
