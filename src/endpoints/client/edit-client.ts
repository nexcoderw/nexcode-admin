import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapClientDetail,
} from "@/endpoints/client/mapper";
import {
    getClientErrorFields,
} from "@/endpoints/client/mutation-errors";
import {
    clientRequestHeaders,
} from "@/endpoints/client/request-headers";
import type {
    ClientMutationCsrf,
    ClientMutationResult,
} from "@/endpoints/client/types";


interface BackendResponse {
    data?: {
        client?: unknown;
    };

    errors?: unknown;
}


export async function editClient(
    clientId: number,
    formData: FormData,
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

                formData,
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
        mapClientDetail(
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