import type {
    NextRequest,
} from "next/server";

import {
    getPaymentOutstandingReport,
} from "@/endpoints/payment/get-outstanding-report";
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
            getPaymentOutstandingReport(
                sessionId,
                forwarded,
                query,
            ),
        "agreement",
    );
}