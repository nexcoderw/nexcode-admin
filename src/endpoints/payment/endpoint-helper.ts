import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    getPaymentErrorFields,
} from "@/endpoints/payment/mutation-errors";
import {
    paymentRequestHeaders,
} from "@/endpoints/payment/request-headers";
import type {
    PaymentEndpointResult,
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

interface BackendEnvelope {
    data?: unknown;
    errors?: unknown;
}

interface PaymentEndpointOptions<T> {
    path: string;

    method?:
        | "GET"
        | "POST"
        | "PATCH"
        | "DELETE";

    body?: unknown;

    sessionId: string;

    csrf?:
        PaymentMutationCsrf;

    forwarded: Headers;

    mapData?: (
        value: unknown,
    ) => T | null;

    allowEmpty?: boolean;
}

export async function requestPaymentEndpoint<T>(
    options:
        PaymentEndpointOptions<T>,
): Promise<
    PaymentEndpointResult<T>
> {
    const result =
        await backendRequest<
            BackendEnvelope
        >(
            options.path,
            {
                method:
                    options.method ??
                    "GET",

                body:
                    options.body,

                forwarded:
                    options.forwarded,

                headers:
                    paymentRequestHeaders(
                        options.sessionId,
                        options.csrf,
                    ),
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            data: null,

            fields:
                getPaymentErrorFields(
                    result.data,
                ),
        };
    }

    if (
        options.allowEmpty
    ) {
        return {
            ok: true,
            status: result.status,
            data: null,
            fields: [],
        };
    }

    if (!options.mapData) {
        return {
            ok: false,
            status: 502,
            data: null,
            fields: [],
        };
    }

    const mapped =
        options.mapData(
            result.data?.data,
        );

    return {
        ok: mapped !== null,

        status:
            mapped !== null
                ? result.status
                : 502,

        data: mapped,

        fields: [],
    };
}
