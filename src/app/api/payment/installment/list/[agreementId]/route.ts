import type {
    NextRequest,
} from "next/server";

import {
    listPaymentInstallments,
} from "@/endpoints/payment/list-installment";
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
        agreementId: string;
    }>;
}

export async function GET(
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

    return handlePaymentRead(
        request,

        (
            sessionId,
            forwarded,
        ) =>
            listPaymentInstallments(
                agreementId,
                sessionId,
                forwarded,
            ),

        "agreement",
    );
}
