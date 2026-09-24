import type {
    NextRequest,
} from "next/server";

import {
    deletePaymentReminderRule,
} from "@/endpoints/payment/delete-reminder-rule";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    handlePaymentMutation,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
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

    return handlePaymentMutation(
        request,

        (
            sessionId,
            csrf,
            forwarded,
        ) =>
            deletePaymentReminderRule(
                ruleId,
                sessionId,
                csrf,
                forwarded,
            ),

        "reminderRule",
    );
}
