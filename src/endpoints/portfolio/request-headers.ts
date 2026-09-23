import "server-only";

import type {
    PortfolioMutationCsrf,
} from "@/endpoints/portfolio/types";

export function portfolioRequestHeaders(
    sessionId: string,
    csrf?: PortfolioMutationCsrf,
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