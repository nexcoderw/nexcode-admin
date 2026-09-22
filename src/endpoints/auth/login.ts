import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import type {
    AdminCsrfContext,
} from "@/endpoints/auth/get-csrf";

export interface AdminLoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface BackendAdmin {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
}

interface BackendLoginResponse {
    status: "success";
    message: string;
    data: {
        admin: BackendAdmin;
    };
}

export async function loginAdmin(
    body: AdminLoginRequest,
    forwarded: Headers,
    csrf: AdminCsrfContext,
) {
    return backendRequest<BackendLoginResponse>(
        "/api/admin/auth/login/",
        {
            method: "POST",
            forwarded,
            headers: {
                Cookie: `csrftoken=${csrf.cookie}`,
                "X-CSRFToken": csrf.token,
            },
            body: {
                email: body.email,
                password: body.password,
                remember_me: body.rememberMe,
            },
        },
    );
}