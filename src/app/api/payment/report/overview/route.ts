import type {
    NextRequest,
} from "next/server";

import {
    getPaymentReportOverview,
} from "@/endpoints/payment/get-report-overview";
import {
    parsePaymentReportSearchParams,
} from "@/utils/payment/report-query";
import {
    handlePaymentRead,
} from "@/utils/payment/payment-route";
import {
    paymentInvalidRequest,
} from "@/utils/payment/payment-responses";

export async function GET(
    request: NextRequest,
) {
    const query =
        parsePaymentReportSearchParams(
            request.nextUrl
                .searchParams,
        );

    if (!query) {
        return (
            paymentInvalidRequest()
        );
    }

    return handlePaymentRead(
        request,
        (
            sessionId,
            forwarded,
        ) =>
            getPaymentReportOverview(
                sessionId,
                forwarded,
                query,
            ),
        "agreement",
    );
}