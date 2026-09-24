import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapContactListData,
} from "@/endpoints/contact/mapper";
import {
    contactRequestHeaders,
} from "@/endpoints/contact/request-headers";
import type {
    ContactListResult,
} from "@/endpoints/contact/types";
import type {
    ContactListQuery,
} from "@/types/contact/contact";


interface BackendResponse {
    status: "success";
    data: unknown;
}


export async function listContacts(
    sessionId: string,
    forwarded: Headers,
    query: ContactListQuery = {},
): Promise<ContactListResult> {
    const result =
        await backendRequest<BackendResponse>(
            buildPath(query),
            {
                method: "GET",
                forwarded,

                headers:
                    contactRequestHeaders(
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
        mapContactListData(
            result.data?.data,
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
    query: ContactListQuery,
) {
    const params =
        new URLSearchParams();

    const values: [string, string | number | undefined][] = [
        ["search", query.search],
        ["status", query.status],
        ["ordering", query.ordering],
        ["page", query.page],
        ["page_size", query.pageSize],
    ];

    for (const [key, value] of values) {
        if (value !== undefined) {
            params.set(
                key,
                String(value),
            );
        }
    }

    const search =
        params.toString();

    return search
        ? `/api/admin/contact/list/?${search}`
        : "/api/admin/contact/list/";
}
