import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapClient,
} from "@/endpoints/client/mapper";
import {
    clientRequestHeaders,
} from "@/endpoints/client/request-headers";
import type {
    ClientDetailResult,
} from "@/endpoints/client/types";


interface BackendResponse {
    status: "success";
    data: {
        client: unknown;
    };
}


export async function getClient(
    clientId: number,
    sessionId: string,
    forwarded: Headers,
): Promise<ClientDetailResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/client/detail/${clientId}/`,
            {
                method: "GET",
                forwarded,

                headers:
                    clientRequestHeaders(
                        sessionId,
                    ),
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            client: null,
        };
    }

    const client =
        mapClient(
            result.data?.data
                ?.client,
        );

    return {
        ok: Boolean(client),

        status: client
            ? result.status
            : 502,

        client,
    };
}