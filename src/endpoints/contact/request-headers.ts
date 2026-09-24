import "server-only";

import type {
    ContactMutationCsrf,
} from "@/endpoints/contact/types";


export function contactRequestHeaders(
    sessionId: string,
    csrf?: ContactMutationCsrf,
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
