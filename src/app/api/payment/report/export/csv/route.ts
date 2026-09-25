import type {
    NextRequest,
} from "next/server";

import {
    getPaymentCollectionsReport,
} from "@/endpoints/payment/get-collections-report";
import {
    getPaymentOutstandingReport,
} from "@/endpoints/payment/get-outstanding-report";
import {
    getPaymentRequestSession,
} from "@/utils/payment/payment-session";
import {
    collectionsReportCsv,
    outstandingReportCsv,
} from "@/utils/payment/report-csv";
import {
    parsePaymentReportSearchParams,
} from "@/utils/payment/report-query";
import {
    paymentAuthenticationRequired,
    paymentInvalidRequest,
    paymentServiceUnavailable,
} from "@/utils/payment/payment-responses";

export async function GET(
    request: NextRequest,
) {
    const type =
        request.nextUrl
            .searchParams
            .get("type");

    if (
        type !== "collections" &&
        type !== "outstanding"
    ) {
        return (
            paymentInvalidRequest()
        );
    }

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

    const session =
        getPaymentRequestSession(
            request,
        );

    if (!session) {
        return (
            paymentAuthenticationRequired()
        );
    }

    const forwarded =
        new Headers(
            request.headers,
        );

    try {
        const result =
            type === "collections"
                ? await getPaymentCollectionsReport(
                    session.sessionId,
                    forwarded,
                    query,
                )
                : await getPaymentOutstandingReport(
                    session.sessionId,
                    forwarded,
                    query,
                );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return (
                paymentAuthenticationRequired()
            );
        }

        if (
            result.status === 400
        ) {
            return (
                paymentInvalidRequest()
            );
        }

        if (
            !result.ok ||
            !result.data
        ) {
            return (
                paymentServiceUnavailable()
            );
        }

        const csv =
            type === "collections"
                ? collectionsReportCsv(
                    result.data,
                )
                : outstandingReportCsv(
                    result.data,
                );

        return new Response(
            `\uFEFF${csv}`,
            {
                status: 200,

                headers: {
                    "Content-Type":
                        "text/csv; charset=utf-8",

                    "Content-Disposition":
                        (
                            `attachment; filename="payment-${type}-report.csv"`
                        ),

                    "Cache-Control":
                        "no-store",

                    "X-Content-Type-Options":
                        "nosniff",
                },
            },
        );
    } catch {
        return (
            paymentServiceUnavailable()
        );
    }
}