import type {
    NextRequest,
} from "next/server";

import {
    addPaymentReminderRule,
} from "@/endpoints/payment/add-reminder-rule";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    sanitizeReminderPayload,
} from "@/utils/payment/reminder-payloads";
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
        sanitizeReminderPayload(
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
            addPaymentReminderRule(
                agreementId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "agreement",
    );
}
