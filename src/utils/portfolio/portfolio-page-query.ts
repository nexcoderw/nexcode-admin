import {
    PORTFOLIO_CATEGORIES,
    PORTFOLIO_ORDERINGS,
    PORTFOLIO_PROJECT_TYPES,
    PORTFOLIO_STATUSES,
} from "@/constants/portfolio/portfolio-options";
import { PORTFOLIO_ROUTES } from "@/constants/routes/portfolio-routes";
import type {
    PortfolioCategory,
    PortfolioListQuery,
    PortfolioOrdering,
    PortfolioProjectType,
    PortfolioStatus,
} from "@/types/portfolio/portfolio";

export interface ResolvedPortfolioListQuery {
    search: string;

    category:
    PortfolioCategory | "";

    projectType:
    PortfolioProjectType | "";

    status:
    PortfolioStatus | "";

    teamMemberId:
    number | null;

    ordering:
    PortfolioOrdering;

    page: number;

    pageSize: number;
}

const DEFAULT_ORDERING:
    PortfolioOrdering =
    "-created_at";

const DEFAULT_PAGE_SIZE = 12;

export function resolvePortfolioListQuery(
    params: Record<
        string,
        string |
        string[] |
        undefined
    >,
): ResolvedPortfolioListQuery {
    return {
        search:
            read(params.search)
                ?.trim()
                .slice(0, 100) ?? "",

        category:
            choice(
                read(params.category),
                PORTFOLIO_CATEGORIES,
            ) ?? "",

        projectType:
            choice(
                read(
                    params.projectType,
                ),
                PORTFOLIO_PROJECT_TYPES,
            ) ?? "",

        status:
            choice(
                read(params.status),
                PORTFOLIO_STATUSES,
            ) ?? "",

        teamMemberId:
            positiveInteger(
                read(
                    params.teamMemberId,
                ),
            ),

        ordering:
            choice(
                read(params.ordering),
                PORTFOLIO_ORDERINGS,
            ) ?? DEFAULT_ORDERING,

        page:
            positiveInteger(
                read(params.page),
            ) ?? 1,

        pageSize:
            DEFAULT_PAGE_SIZE,
    };
}

export function toPortfolioEndpointQuery(
    query:
        ResolvedPortfolioListQuery,
): PortfolioListQuery {
    return {
        search:
            query.search ||
            undefined,

        category:
            query.category ||
            undefined,

        projectType:
            query.projectType ||
            undefined,

        status:
            query.status ||
            undefined,

        teamMemberId:
            query.teamMemberId ??
            undefined,

        ordering:
            query.ordering,

        page:
            query.page,

        pageSize:
            query.pageSize,
    };
}

export function buildPortfolioListHref(
    query:
        ResolvedPortfolioListQuery,
    page: number,
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
        "projectType",
        query.projectType,
    );

    set(
        params,
        "status",
        query.status,
    );

    if (query.teamMemberId) {
        set(
            params,
            "teamMemberId",
            query.teamMemberId,
        );
    }

    if (
        query.ordering !==
        DEFAULT_ORDERING
    ) {
        set(
            params,
            "ordering",
            query.ordering,
        );
    }

    if (page > 1) {
        set(
            params,
            "page",
            page,
        );
    }

    const value =
        params.toString();

    return value
        ? `${PORTFOLIO_ROUTES.list}?${value}`
        : PORTFOLIO_ROUTES.list;
}

function read(
    value:
        | string
        | string[]
        | undefined,
) {
    return Array.isArray(value)
        ? value[0]
        : value;
}

function choice<
    T extends string,
>(
    value: string | undefined,
    options: readonly T[],
): T | null {
    if (!value) {
        return null;
    }

    return (
        options as
        readonly string[]
    ).includes(value)
        ? value as T
        : null;
}

function positiveInteger(
    value: string | undefined,
) {
    if (
        !value ||
        !/^\d+$/.test(value)
    ) {
        return null;
    }

    const parsed =
        Number(value);

    return (
        Number.isSafeInteger(
            parsed,
        ) &&
        parsed > 0
    )
        ? parsed
        : null;
}

function set(
    params: URLSearchParams,
    key: string,
    value:
        | string
        | number,
) {
    if (value !== "") {
        params.set(
            key,
            String(value),
        );
    }
}