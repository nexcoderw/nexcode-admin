import type {
    NextRequest,
} from "next/server";

import {
    getPaymentAgreement,
} from "@/endpoints/payment/get-agreement";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
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

    return handlePaymentRead(
        request,

        (
            sessionId,
            forwarded,
        ) =>
            getPaymentAgreement(
                agreementId,
                sessionId,
                forwarded,
            ),

        "agreement",
    );
}
