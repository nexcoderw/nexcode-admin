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

export interface PasswordResetConfirmationRequest {
    resetToken: string;
    password: string;
    confirmPassword: string;
}

interface BackendPasswordResetConfirmationResponse {
    status: "success";
    message: string;
}

export async function confirmAdminPasswordReset(
    body: PasswordResetConfirmationRequest,
    forwarded: Headers,
    csrf: AdminCsrfContext,
) {
    return backendRequest<BackendPasswordResetConfirmationResponse>(
        "/api/admin/auth/password-reset/confirm/",
        {
            method: "POST",
            forwarded,
            headers:
                getDjangoCsrfHeaders(csrf),
            body: {
                reset_token:
                    body.resetToken,
                password:
                    body.password,
                confirm_password:
                    body.confirmPassword,
            },
        },
    );
}