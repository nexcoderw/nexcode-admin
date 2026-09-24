import "server-only";

import {
    cookies,
    headers,
} from "next/headers";

import {
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";

export interface ClientServerContext {
    sessionId: string;
    forwarded: Headers;
}

export async function getClientServerContext():
    Promise<
        ClientServerContext | null
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