import type {
    NextRequest,
} from "next/server";

import {
    listPaymentRecords,
} from "@/endpoints/payment/list-records";
import {
    parseRecordQuery,
} from "@/utils/payment/record-query";
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
        parseRecordQuery(
            request.nextUrl
                .searchParams,
        );

    if (!query) {
        return paymentInvalidRequest();
    }

    return handlePaymentRead(
        request,

        (
            sessionId,
            forwarded,
        ) =>
            listPaymentRecords(
                sessionId,
                forwarded,
                query,
            ),

        "record",
    );
}
