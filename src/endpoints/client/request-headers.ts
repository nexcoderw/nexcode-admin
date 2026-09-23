import "server-only";

import type {
    ClientMutationCsrf,
} from "@/endpoints/client/types";


export function clientRequestHeaders(
    sessionId: string,
    csrf?: ClientMutationCsrf,
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