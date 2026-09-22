import "server-only";

import {
    cookies,
    headers,
} from "next/headers";

import {
    getAdminMe,
} from "@/endpoints/auth/me";
import type {
    AdminIdentity,
} from "@/types/shared/auth";
import {
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";

export type CurrentAdminResult =
    | {
        status: "authenticated";
        admin: AdminIdentity;
    }
    | {
        status: "unauthenticated";
    }
    | {
        status: "unavailable";
    };

export async function getCurrentAdmin():
    Promise<CurrentAdminResult> {
    const cookieStore = await cookies();

    const sessionId =
        cookieStore.get(
            ADMIN_SESSION_COOKIE_NAME,
        )?.value;

    if (!sessionId) {
        return {
            status: "unauthenticated",
        };
    }

    const incomingHeaders =
        await headers();

    const forwarded = new Headers();

    incomingHeaders.forEach(
        (value, key) => {
            forwarded.set(key, value);
        },
    );

    try {
        const result = await getAdminMe(
            sessionId,
            forwarded,
        );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return {
                status: "unauthenticated",
            };
        }

        if (!result.ok || !result.admin) {
            return {
                status: "unavailable",
            };
        }

        return {
            status: "authenticated",
            admin: result.admin,
        };
    } catch {
        return {
            status: "unavailable",
        };
    }
}