import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import type {
    AdminCsrfContext,
} from "@/endpoints/auth/get-csrf";
import {
    getDjangoCsrfHeaders,
} from "@/utils/auth/django-csrf";

export interface PasswordResetRequest {
    email: string;
}

interface BackendPasswordResetRequestResponse {
    status: "success";
    message: string;
    data: {
        challenge_id: string;
    };
}

export async function requestAdminPasswordReset(
    body: PasswordResetRequest,
    forwarded: Headers,
    csrf: AdminCsrfContext,
) {
    return backendRequest<BackendPasswordResetRequestResponse>(
        "/api/admin/auth/password-reset/request/",
        {
            method: "POST",
            forwarded,
            headers:
                getDjangoCsrfHeaders(csrf),
            body: {
                email: body.email,
            },
        },
    );
}