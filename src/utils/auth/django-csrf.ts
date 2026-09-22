import "server-only";

import type {
    AdminCsrfContext,
} from "@/endpoints/auth/get-csrf";

export function getDjangoCsrfHeaders(
    csrf: AdminCsrfContext,
): HeadersInit {
    return {
        Cookie: `csrftoken=${encodeURIComponent(
            csrf.cookie,
        )}`,
        "X-CSRFToken": csrf.token,
    };
}