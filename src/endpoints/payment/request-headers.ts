import "server-only";

import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

export function paymentRequestHeaders(
    sessionId: string,
    csrf?: PaymentMutationCsrf,
) {
    const cookies = [
        `sessionid=${encodeURIComponent(
            sessionId,
        )}`,
    ];

    const headers =
        new Headers();

    if (csrf) {
        cookies.push(
            `csrftoken=${encodeURIComponent(
                csrf.cookie,
            )}`,
        );

        headers.set(
            "X-CSRFToken",
            csrf.token,
        );
    }

    headers.set(
        "Cookie",
        cookies.join("; "),
    );

    return headers;
}
