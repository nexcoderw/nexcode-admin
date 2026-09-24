import type {
    NextRequest,
} from "next/server";

import {
    editPaymentReminderRule,
} from "@/endpoints/payment/edit-reminder-rule";
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
        id: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext,
) {
    const { id } =
        await context.params;

    const ruleId =
        parsePaymentId(id);

    if (!ruleId) {
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
            editPaymentReminderRule(
                ruleId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "reminderRule",
    );
}
