import type {
    NextRequest,
} from "next/server";

import {
    generateMaintenanceSchedule,
} from "@/endpoints/payment/generate-maintenance-schedule";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    sanitizeMaintenanceSchedulePayload,
} from "@/utils/payment/schedule-payloads";
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
        sanitizeMaintenanceSchedulePayload(
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
            generateMaintenanceSchedule(
                agreementId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "agreement",
    );
}
