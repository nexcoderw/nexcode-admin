import type {
    NextRequest,
} from "next/server";

import {
    deletePaymentInstallment,
} from "@/endpoints/payment/delete-installment";
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

    const installmentId =
        parsePaymentId(id);

    if (!installmentId) {
        return paymentInvalidRequest();
    }

    return handlePaymentMutation(
        request,

        (
            sessionId,
            csrf,
            forwarded,
        ) =>
            deletePaymentInstallment(
                installmentId,
                sessionId,
                csrf,
                forwarded,
            ),

        "installment",
    );
}
