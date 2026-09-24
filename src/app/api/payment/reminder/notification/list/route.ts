import type {
    NextRequest,
} from "next/server";

import {
    listPaymentNotifications,
} from "@/endpoints/payment/list-notifications";
import {
    parseNotificationQuery,
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
        parseNotificationQuery(
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
            listPaymentNotifications(
                sessionId,
                forwarded,
                query,
            ),

        "notification",
    );
}
