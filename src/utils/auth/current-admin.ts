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
        /** No session at all: the visitor has not signed in. */
        status: "unauthenticated";
    }
    | {
        /** A session existed, but the backend no longer accepts it. */
        status: "expired";
    }
    | {
        /** Signed in, but not an administrator of this portal. */
        status: "forbidden";
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

        // A 401 and a 403 mean different things and lead to different
        // pages: an ended session can be fixed by signing in again, but
        // a refused administrator cannot, so sending them to the login
        // form would only loop them back here.
        if (result.status === 401) {
            return {
                status: "expired",
            };
        }

        if (result.status === 403) {
            return {
                status: "forbidden",
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