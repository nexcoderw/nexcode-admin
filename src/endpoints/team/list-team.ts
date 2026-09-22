import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapTeamListData,
} from "@/endpoints/team/mapper";
import type {
    TeamListResult,
} from "@/endpoints/team/types";
import type {
    TeamListQuery,
} from "@/types/team/team";

interface BackendListResponse {
    status: "success";
    data: {
        items: unknown;
        pagination: unknown;
    };
}

export async function listTeam(
    sessionId: string,
    forwarded: Headers,
    query: TeamListQuery = {},
): Promise<TeamListResult> {
    const result =
        await backendRequest<BackendListResponse>(
            buildPath(query),
            {
                method: "GET",
                forwarded,
                headers: {
                    Cookie:
                        `sessionid=${encodeURIComponent(
                            sessionId,
                        )}`,
                },
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
        mapTeamListData(
            result.data?.data?.items,
            result.data?.data
                ?.pagination,
        );

    if (!data) {
        return {
            ok: false,
            status: 502,
            data: null,
        };
    }

    return {
        ok: true,
        status: result.status,
        data,
    };
}

function buildPath(
    query: TeamListQuery,
) {
    const search =
        new URLSearchParams();

    if (query.search) {
        search.set(
            "search",
            query.search,
        );
    }

    if (query.ordering) {
        search.set(
            "ordering",
            query.ordering,
        );
    }

    if (query.page) {
        search.set(
            "page",
            String(query.page),
        );
    }

    if (query.pageSize) {
        search.set(
            "page_size",
            String(query.pageSize),
        );
    }

    const queryString =
        search.toString();

    return queryString
        ? `/api/admin/team/list/?${queryString}`
        : "/api/admin/team/list/";
}