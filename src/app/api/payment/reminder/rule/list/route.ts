import type {
    NextRequest,
} from "next/server";

import {
    listPaymentReminderRules,
} from "@/endpoints/payment/list-reminder-rules";
import {
    parseReminderRuleQuery,
} from "@/utils/payment/reminder-query";
import {
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

export async function GET(
    request: NextRequest,
) {
    const query =
        parseReminderRuleQuery(
            request.nextUrl
                .searchParams,
        );

    if (!query) {
        return paymentInvalidRequest();
    }

    return handlePaymentRead(
        request,

        (
            sessionId,
            forwarded,
        ) =>
            listPaymentReminderRules(
                sessionId,
                forwarded,
                query,
            ),

        "reminderRule",
    );
}
