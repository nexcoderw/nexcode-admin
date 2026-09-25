import type {
    NextRequest,
} from "next/server";

import {
    getPaymentReceipt,
    getPaymentReceiptPdf,
} from "@/endpoints/payment/get-payment-receipt";
import {
    parsePaymentId,
} from "@/utils/payment/payment-id";
import {
    handlePaymentBinaryRead,
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

interface RouteContext {
    params:
    Promise<{
        paymentId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext,
) {
    const {
        paymentId:
        rawId,
    } = await context.params;

    const paymentId =
        parsePaymentId(
            rawId
        );

    if (!paymentId) {
        return (
            paymentInvalidRequest()
        );
    }

    if (
        request.nextUrl
            .searchParams
            .get("format")
        === "pdf"
    ) {
        return (
            handlePaymentBinaryRead(
                request,
                (
                    sessionId,
                    forwarded,
                ) =>
                    getPaymentReceiptPdf(
                        paymentId,
                        sessionId,
                        forwarded,
                    ),
                "record",
                `payment-receipt-${paymentId}.pdf`,
            )
        );
    }

    return handlePaymentRead(
        request,
        (
            sessionId,
            forwarded,
        ) =>
            getPaymentReceipt(
                paymentId,
                sessionId,
                forwarded,
            ),
        "record",
    );
}