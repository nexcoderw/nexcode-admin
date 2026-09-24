import type {
    NextRequest,
} from "next/server";

import {
    getPaymentReminderRule,
} from "@/endpoints/payment/get-reminder-rule";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
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

    return handlePaymentRead(
        request,

        (
            sessionId,
            forwarded,
        ) =>
            getPaymentReminderRule(
                ruleId,
                sessionId,
                forwarded,
            ),

        "reminderRule",
    );
}
