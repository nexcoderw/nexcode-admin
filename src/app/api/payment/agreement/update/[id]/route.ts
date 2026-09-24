import type {
    NextRequest,
} from "next/server";

import {
    editPaymentAgreement,
} from "@/endpoints/payment/edit-agreement";
import {
    sanitizeAgreementPayload,
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

    const agreementId =
        parsePaymentId(id);

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
        sanitizeAgreementPayload(
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
            editPaymentAgreement(
                agreementId,
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "agreement",
    );
}
