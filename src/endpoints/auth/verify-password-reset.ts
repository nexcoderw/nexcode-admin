import "server-only";

import type {
    AdminCsrfContext,
} from "@/endpoints/auth/get-csrf";
import {
    backendRequest,
} from "@/endpoints/client";
import {
    getDjangoCsrfHeaders,
} from "@/utils/auth/django-csrf";

export interface PasswordResetVerificationRequest {
    challengeId: string;
    code: string;
}

interface BackendPasswordResetVerificationResponse {
    status: "success";
    message: string;
    data: {
        reset_token: string;
    };
}

export async function verifyAdminPasswordReset(
    body: PasswordResetVerificationRequest,
    forwarded: Headers,
    csrf: AdminCsrfContext,
) {
    return backendRequest<BackendPasswordResetVerificationResponse>(
        "/api/admin/auth/password-reset/verify/",
        {
            method: "POST",
            forwarded,
            headers:
                getDjangoCsrfHeaders(csrf),
            body: {
                challenge_id:
                    body.challengeId,
                code: body.code,
            },
        },
    );
}