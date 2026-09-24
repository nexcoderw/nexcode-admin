import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapClient,
} from "@/endpoints/client/mapper";
import {
    getClientErrorFields,
} from "@/endpoints/client/mutation-errors";
import {
    toBackendClientPayload,
} from "@/endpoints/client/payload";
import {
    clientRequestHeaders,
} from "@/endpoints/client/request-headers";
import type {
    ClientMutationCsrf,
    ClientMutationResult,
} from "@/endpoints/client/types";
import type {
    ClientInput,
} from "@/types/client/client";


interface BackendResponse {
    data?: {
        client?: unknown;
    };

    errors?: unknown;
}


export async function editClient(
    clientId: number,
    input: ClientInput,
    sessionId: string,
    csrf: ClientMutationCsrf,
    forwarded: Headers,
): Promise<ClientMutationResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/client/update/${clientId}/`,
            {
                method: "PATCH",
                forwarded,

                headers:
                    clientRequestHeaders(
                        sessionId,
                        csrf,
                    ),

                body:
                    toBackendClientPayload(
                        input,
                    ),
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            client: null,

            fields:
                getClientErrorFields(
                    result.data,
                ),
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
        fields: [],
    };
}
