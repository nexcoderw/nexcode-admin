import "server-only";

import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import type {
    ContactMutationCsrf,
} from "@/endpoints/contact/types";


interface MutationResult {
    status: number;
}


export async function runContactMutation<
    TResult extends MutationResult,
>(
    sessionId: string,
    storedCsrf: string | null,
    forwarded: Headers,
    mutation: (
        csrf: ContactMutationCsrf,
    ) => Promise<TResult>,
): Promise<TResult | null> {
    let csrf =
        storedCsrf
            ? {
                cookie:
                    storedCsrf,

                token:
                    storedCsrf,
            }
            : await getAdminCsrf(
                forwarded,
                sessionId,
            );

    if (!csrf) {
        return null;
    }

    let result =
        await mutation(
            csrf,
        );

    if (result.status !== 403) {
        return result;
    }

    csrf =
        await getAdminCsrf(
            forwarded,
            sessionId,
        );

    if (!csrf) {
        return result;
    }

    result =
        await mutation(
            csrf,
        );

    return result;
}