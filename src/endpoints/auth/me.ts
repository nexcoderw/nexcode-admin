import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import type {
    AdminIdentity,
} from "@/types/shared/auth";

interface BackendAdmin {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
}

interface BackendMeResponse {
    status: "success";
    data: {
        admin: BackendAdmin;
    };
}

export interface AdminMeResult {
    ok: boolean;
    status: number;
    admin: AdminIdentity | null;
}

export async function getAdminMe(
    sessionId: string,
    forwarded: Headers,
): Promise<AdminMeResult> {
    const result =
        await backendRequest<BackendMeResponse>(
            "/api/admin/auth/me/",
            {
                method: "GET",
                forwarded,
                headers: {
                    Cookie: `sessionid=${encodeURIComponent(
                        sessionId,
                    )}`,
                },
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            admin: null,
        };
    }

    const admin =
        result.data?.data?.admin;

    if (!isBackendAdmin(admin)) {
        return {
            ok: false,
            status: 502,
            admin: null,
        };
    }

    return {
        ok: true,
        status: result.status,
        admin: {
            id: admin.id,
            email: admin.email,
            firstName: admin.first_name,
            lastName: admin.last_name,
            fullName:
                admin.full_name.trim() ||
                admin.email,
        },
    };
}

function isBackendAdmin(
    value: unknown,
): value is BackendAdmin {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return false;
    }

    const admin =
        value as Partial<BackendAdmin>;

    return (
        typeof admin.id === "number" &&
        typeof admin.email === "string" &&
        typeof admin.first_name ===
        "string" &&
        typeof admin.last_name ===
        "string" &&
        typeof admin.full_name ===
        "string"
    );
}