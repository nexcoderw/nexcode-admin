import type {
    NextRequest,
} from "next/server";

import {
    readAllPaymentNotifications,
} from "@/endpoints/payment/read-all-notifications";
import {
    handlePaymentMutation,
} from "@/utils/payment/payment-route";

export async function POST(
    request: NextRequest,
) {
    return handlePaymentMutation(
        request,

        (
            sessionId,
            csrf,
            forwarded,
        ) =>
            readAllPaymentNotifications(
                sessionId,
                csrf,
                forwarded,
            ),

        "notification",
    );
}
