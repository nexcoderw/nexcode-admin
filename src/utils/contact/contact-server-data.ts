import "server-only";

import {
    cookies,
    headers,
} from "next/headers";

import {
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";

export interface ContactServerContext {
    sessionId: string;
    forwarded: Headers;
}

export async function getContactServerContext():
    Promise<
        ContactServerContext | null
    > {
    const cookieStore =
        await cookies();

    const sessionId =
        cookieStore.get(
            ADMIN_SESSION_COOKIE_NAME,
        )?.value;

    if (!sessionId) {
        return null;
    }

    const requestHeaders =
        await headers();

    const forwarded =
        new Headers();

    requestHeaders.forEach(
        (value, key) => {
            forwarded.set(
                key,
                value,
            );
        },
    );

    return {
        sessionId,
        forwarded,
    };
}