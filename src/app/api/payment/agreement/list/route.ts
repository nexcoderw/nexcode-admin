import type {
    NextRequest,
} from "next/server";

import {
    listPaymentAgreements,
} from "@/endpoints/payment/list-agreement";
import {
    parseAgreementQuery,
} from "@/utils/payment/agreement-query";
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
        parseAgreementQuery(
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
            listPaymentAgreements(
                sessionId,
                forwarded,
                query,
            ),

        "agreement",
    );
}