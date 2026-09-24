import type {
    NextRequest,
} from "next/server";

import {
    waivePaymentInstallment,
} from "@/endpoints/payment/waive-installment";
import {
    sanitizeReasonPayload,
} from "@/utils/payment/payloads";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
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

export async function POST(
    request: NextRequest,
    context: RouteContext,
) {
    const { id } =
        await context.params;

    const installmentId =
        parsePaymentId(id);

    if (!installmentId) {
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
        sanitizeReasonPayload(
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
            waivePaymentInstallment(
                installmentId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "installment",
    );
}
