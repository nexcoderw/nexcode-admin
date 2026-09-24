import type {
    NextRequest,
} from "next/server";

import {
    editPaymentInstallment,
} from "@/endpoints/payment/edit-installment";
import {
    sanitizeInstallmentPayload,
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

export async function PATCH(
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
        sanitizeInstallmentPayload(
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
            editPaymentInstallment(
                installmentId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "installment",
    );
}
