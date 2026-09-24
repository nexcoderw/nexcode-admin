import type {
    NextRequest,
} from "next/server";

import {
    deletePaymentAgreement,
} from "@/endpoints/payment/delete-agreement";
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

export async function DELETE(
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

    return handlePaymentMutation(
        request,

        (
            sessionId,
            csrf,
            forwarded,
        ) =>
            deletePaymentAgreement(
                agreementId,
                sessionId,
                csrf,
                forwarded,
            ),

        "agreement",
    );
}
