import type {
    NextRequest,
} from "next/server";

import {
    readPaymentNotification,
} from "@/endpoints/payment/read-notification";
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

export async function POST(
    request: NextRequest,
    context: RouteContext,
) {
    const { id } =
        await context.params;

    const notificationId =
        parsePaymentId(id);

    if (!notificationId) {
        return paymentInvalidRequest();
    }

    return handlePaymentMutation(
        request,

        (
            sessionId,
            csrf,
            forwarded,
        ) =>
            readPaymentNotification(
                notificationId,
                sessionId,
                csrf,
                forwarded,
            ),

        "notification",
    );
}
