import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";

export interface AdminLogoutCsrf {
    cookie: string;
    token: string;
}

interface BackendLogoutResponse {
    status: "success";
    message: string;
}

export async function logoutAdmin(
    sessionId: string,
    csrf: AdminLogoutCsrf,
    forwarded: Headers,
) {
    return backendRequest<BackendLogoutResponse>(
        "/api/admin/auth/logout/",
        {
            method: "POST",
            forwarded,
            headers: {
                Cookie: [
                    `sessionid=${encodeURIComponent(
                        sessionId,
                    )}`,
                    `csrftoken=${encodeURIComponent(
                        csrf.cookie,
                    )}`,
                ].join("; "),
                "X-CSRFToken": csrf.token,
            },
        },
    );
}