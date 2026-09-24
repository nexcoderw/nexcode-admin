import type {
    NextRequest,
} from "next/server";

import {
    addPaymentAgreement,
} from "@/endpoints/payment/add-agreement";
import {
    sanitizeAgreementPayload,
} from "@/utils/payment/payloads";
import {
    handlePaymentMutation,
    readPaymentJson,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

export async function POST(
    request: NextRequest,
) {
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
            addPaymentAgreement(
                input,
                sessionId,
                csrf,
                forwarded,
            ),

        "agreement",
    );
}