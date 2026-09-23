import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapClientListData,
} from "@/endpoints/client/mapper";
import {
    clientRequestHeaders,
} from "@/endpoints/client/request-headers";
import type {
    ClientListResult,
} from "@/endpoints/client/types";
import type {
    ClientListQuery,
} from "@/types/client/client";


interface BackendResponse {
    status: "success";
    data: {
        items: unknown;
        pagination: unknown;
    };
}


export async function listClients(
    sessionId: string,
    forwarded: Headers,
    query: ClientListQuery = {},
): Promise<ClientListResult> {
    const result =
        await backendRequest<BackendResponse>(
            buildPath(query),
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
            data: null,
        };
    }

    const data =
        mapClientListData(
            result.data?.data?.items,
            result.data?.data
                ?.pagination,
        );

    return {
        ok: Boolean(data),

        status: data
            ? result.status
            : 502,

        data,
    };
}


function buildPath(
    query: ClientListQuery,
) {
    const params =
        new URLSearchParams();

    set(
        params,
        "search",
        query.search,
    );

    set(
        params,
        "status",
        query.status,
    );

    set(
        params,
        "ordering",
        query.ordering,
    );

    set(
        params,
        "page",
        query.page,
    );

    set(
        params,
        "page_size",
        query.pageSize,
    );

    const value =
        params.toString();

    return value
        ? `/api/admin/client/list/?${value}`
        : "/api/admin/client/list/";
}


function set(
    params: URLSearchParams,
    key: string,
    value:
        | string
        | number
        | undefined,
) {
    if (value !== undefined) {
        params.set(
            key,
            String(value),
        );
    }
}