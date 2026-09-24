import {
    CLIENT_ORDERINGS,
    CLIENT_STATUSES,
} from "@/constants/client/client-options";
import {
    CLIENT_ROUTES,
} from "@/constants/routes/client-routes";
import type {
    ClientListQuery,
    ClientOrdering,
    ClientStatus,
} from "@/types/client/client";

export interface ResolvedClientListQuery {
    search: string;

    status:
    | ClientStatus
    | "";

    ordering:
    ClientOrdering;

    page: number;
    pageSize: number;
}

type PageSearchParams =
    Record<
        string,
        string |
        string[] |
        undefined
    >;

export function resolveClientListQuery(
    params: PageSearchParams,
): ResolvedClientListQuery {
    const status =
        value(params.status);

    const ordering =
        value(params.ordering);

    return {
        search:
            value(params.search)
                .trim()
                .slice(0, 100),

        status:
            isChoice(
                status,
                CLIENT_STATUSES,
            )
                ? status
                : "",

        ordering:
            isChoice(
                ordering,
                CLIENT_ORDERINGS,
            )
                ? ordering
                : "-created_at",

        page:
            positiveInteger(
                value(params.page),
                1,
            ),

        pageSize: 12,
    };
}

export function toClientEndpointQuery(
    query: ResolvedClientListQuery,
): ClientListQuery {
    return {
        search:
            query.search ||
            undefined,

        status:
            query.status ||
            undefined,

        ordering:
            query.ordering,

        page:
            query.page,

        pageSize:
            query.pageSize,
    };
}

export function buildClientListHref(
    query: ResolvedClientListQuery,
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
        "status",
        query.status,
    );

    if (
        query.ordering !==
        "-created_at"
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

    const search =
        params.toString();

    return search
        ? `${CLIENT_ROUTES.list}?${search}`
        : CLIENT_ROUTES.list;
}

function value(
    input:
        | string
        | string[]
        | undefined,
) {
    return (
        Array.isArray(input)
            ? input[0]
            : input
    ) ?? "";
}

function positiveInteger(
    input: string,
    fallback: number,
) {
    if (!/^\d+$/.test(input)) {
        return fallback;
    }

    const parsed =
        Number(input);

    return (
        Number.isSafeInteger(
            parsed,
        ) &&
        parsed > 0
    )
        ? parsed
        : fallback;
}

function isChoice<
    T extends string,
>(
    valueToCheck: string,
    choices: readonly T[],
): valueToCheck is T {
    return (
        choices as
        readonly string[]
    ).includes(valueToCheck);
}

function set(
    params: URLSearchParams,
    key: string,
    input:
        | string
        | number,
) {
    if (
        input !== "" &&
        input !== undefined
    ) {
        params.set(
            key,
            String(input),
        );
    }
}