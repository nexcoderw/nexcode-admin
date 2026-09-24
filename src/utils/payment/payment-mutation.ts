import "server-only";

import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";

interface MutationResult {
    status: number;
}

export async function runPaymentMutation<
    TResult extends MutationResult,
>(
    sessionId: string,
    storedCsrf: string | null,
    forwarded: Headers,
    mutation: (
        csrf: PaymentMutationCsrf,
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

    const result =
        await mutation(
            csrf,
        );

    if (
        result.status !== 403
    ) {
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

    return mutation(
        csrf,
    );
}
