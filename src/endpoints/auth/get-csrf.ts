import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    getSetCookieValue,
} from "@/utils/auth/backend-cookies";

interface BackendCsrfResponse {
    status: "success";
    data: {
        csrf_token: string;
    };
}

export interface AdminCsrfContext {
    token: string;
    cookie: string;
}

export async function getAdminCsrf(
    forwarded: Headers,
    sessionId?: string,
): Promise<AdminCsrfContext | null> {
    const result =
        await backendRequest<BackendCsrfResponse>(
            "/api/admin/auth/csrf/",
            {
                method: "GET",
                forwarded,
                headers: sessionId
                    ? {
                        Cookie: `sessionid=${encodeURIComponent(
                            sessionId,
                        )}`,
                    }
                    : undefined,
            },
        );

    if (!result.ok || !result.data) {
        return null;
    }

    const token =
        result.data.data?.csrf_token;

    const cookie = getSetCookieValue(
        result.headers,
        "csrftoken",
    );

    if (
        typeof token !== "string" ||
        !token ||
        !cookie
    ) {
        return null;
    }

    return {
        token,
        cookie,
    };
}