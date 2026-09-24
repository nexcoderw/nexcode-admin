import type {
    NextRequest,
} from "next/server";

import {
    addPaymentRecord,
} from "@/endpoints/payment/add-record";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    sanitizeRecordPayload,
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
        agreementId: string;
    }>;
}

export async function POST(
    request: NextRequest,
    context: RouteContext,
) {
    const params =
        await context.params;

    const agreementId =
        parsePaymentId(
            params.agreementId,
        );

    if (!agreementId) {
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
        sanitizeRecordPayload(
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
            addPaymentRecord(
                agreementId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "agreement",
    );
}
