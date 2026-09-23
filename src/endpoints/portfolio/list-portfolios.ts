import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapPortfolioListData,
} from "@/endpoints/portfolio/mapper";
import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import type {
    PortfolioListResult,
} from "@/endpoints/portfolio/types";
import type {
    PortfolioListQuery,
} from "@/types/portfolio/portfolio";

interface BackendResponse {
    status: "success";
    data: {
        items: unknown;
        pagination: unknown;
    };
}

export async function listPortfolios(
    sessionId: string,
    forwarded: Headers,
    query: PortfolioListQuery = {},
): Promise<PortfolioListResult> {
    const result =
        await backendRequest<BackendResponse>(
            buildPath(query),
            {
                method: "GET",
                forwarded,
                headers:
                    portfolioRequestHeaders(
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
        mapPortfolioListData(
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
    query: PortfolioListQuery,
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
        "category",
        query.category,
    );

    set(
        params,
        "project_type",
        query.projectType,
    );

    set(
        params,
        "status",
        query.status,
    );

    set(
        params,
        "team_member_id",
        query.teamMemberId,
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
        ? `/api/admin/portfolio/list/?${value}`
        : "/api/admin/portfolio/list/";
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