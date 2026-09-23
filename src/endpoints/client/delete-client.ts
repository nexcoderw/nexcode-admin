import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    clientRequestHeaders,
} from "@/endpoints/client/request-headers";
import type {
    ClientDeleteResult,
    ClientMutationCsrf,
} from "@/endpoints/client/types";


export async function deleteClient(
    clientId: number,
    sessionId: string,
    csrf: ClientMutationCsrf,
    forwarded: Headers,
): Promise<ClientDeleteResult> {
    const result =
        await backendRequest<null>(
            `/api/admin/client/delete/${clientId}/`,
            {
                method: "DELETE",
                forwarded,

                headers:
                    clientRequestHeaders(
                        sessionId,
                        csrf,
                    ),
            },
        );

    return {
        ok: result.ok,
        status: result.status,
    };
}