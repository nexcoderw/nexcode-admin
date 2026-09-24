import {
    CONTACT_ORDERINGS,
    CONTACT_STATUSES,
} from "@/constants/contact/contact-options";
import {
    CONTACT_ROUTES,
} from "@/constants/routes/contact-routes";
import type {
    ContactListQuery,
    ContactOrdering,
    ContactStatus,
} from "@/types/contact/contact";

export interface ResolvedContactListQuery {
    search: string;

    /**
     * An empty string shows every message.
     */
    status: ContactStatus | "";

    ordering: ContactOrdering;
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

const DEFAULT_ORDERING:
    ContactOrdering = "-created_at";

/**
 * Read the page's search params, replacing anything invalid with its
 * default so a hand-edited URL still shows the inbox.
 */
export function resolveContactListQuery(
    params: PageSearchParams,
): ResolvedContactListQuery {
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
                CONTACT_STATUSES,
            )
                ? status
                : "",

        ordering:
            isChoice(
                ordering,
                CONTACT_ORDERINGS,
            )
                ? ordering
                : DEFAULT_ORDERING,

        page:
            positiveInteger(
                value(params.page),
            ),

        pageSize: 15,
    };
}

export function toContactEndpointQuery(
    query: ResolvedContactListQuery,
): ContactListQuery {
    return {
        search:
            query.search ||
            undefined,

        status:
            query.status ||
            undefined,

        ordering:
            query.ordering,

        page: query.page,
        pageSize: query.pageSize,
    };
}

export function isContactQueryFiltered(
    query: ResolvedContactListQuery,
) {
    return (
        Boolean(query.search) ||
        Boolean(query.status) ||
        query.ordering !==
            DEFAULT_ORDERING
    );
}

export function buildContactListHref(
    query: ResolvedContactListQuery,
    page: number,
) {
    const params =
        new URLSearchParams();

    if (query.search) {
        params.set(
            "search",
            query.search,
        );
    }

    if (query.status) {
        params.set(
            "status",
            query.status,
        );
    }

    if (
        query.ordering !==
        DEFAULT_ORDERING
    ) {
        params.set(
            "ordering",
            query.ordering,
        );
    }

    if (page > 1) {
        params.set(
            "page",
            String(page),
        );
    }

    const search =
        params.toString();

    return search
        ? `${CONTACT_ROUTES.list}?${search}`
        : CONTACT_ROUTES.list;
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
) {
    if (!/^\d+$/.test(input)) {
        return 1;
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
        : 1;
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
