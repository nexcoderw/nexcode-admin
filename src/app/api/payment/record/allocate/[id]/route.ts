import type {
    NextRequest,
} from "next/server";

import {
    allocatePaymentRecord,
} from "@/endpoints/payment/allocate-record";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    sanitizeAllocationPayload,
} from "@/utils/payment/record-payloads";
import {
    handlePaymentMutation,
    readPaymentJson,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: NextRequest,
    context: RouteContext,
) {
    const { id } =
        await context.params;

    const paymentId =
        parsePaymentId(id);

    if (!paymentId) {
        return paymentInvalidRequest();
    }

    const body =
        await readPaymentJson(
            request,
        );

    if (!body.ok) {
        return paymentInvalidRequest();
    }

    const input =
        sanitizeAllocationPayload(
            body.value,
        );

    if (!input) {
        return paymentInvalidRequest();
    }

    return handlePaymentMutation(
        request,

        (
            sessionId,
            csrf,
            forwarded,
        ) =>
            allocatePaymentRecord(
                paymentId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "record",
    );
}
