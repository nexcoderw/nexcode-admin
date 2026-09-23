import {
    CLIENT_ORDERINGS,
    CLIENT_STATUSES,
} from "@/constants/client/client-options";
import type {
    ClientListQuery,
    ClientOrdering,
    ClientStatus,
} from "@/types/client/client";


export function parseClientListQuery(
    params: URLSearchParams,
): ClientListQuery | null {
    const status =
        parseChoice(
            params.get("status"),
            CLIENT_STATUSES,
        );

    const ordering =
        parseChoice(
            params.get("ordering"),
            CLIENT_ORDERINGS,
        );

    if (
        status === null ||
        ordering === null
    ) {
        return null;
    }

    const page =
        parsePositiveInteger(
            params.get("page"),
        );

    const pageSize =
        parsePositiveInteger(
            params.get("pageSize"),
        );

    if (
        page === null ||
        pageSize === null ||
        (
            pageSize !== undefined &&
            pageSize > 100
        )
    ) {
        return null;
    }

    return {
        search:
            params.get("search")
                ?.trim() ||
            undefined,

        status:
            status as
            | ClientStatus
            | undefined,

        ordering:
            ordering as
            | ClientOrdering
            | undefined,

        page,
        pageSize,
    };
}


function parseChoice<
    T extends string,
>(
    value: string | null,
    choices: readonly T[],
): T | undefined | null {
    if (value === null) {
        return undefined;
    }

    return (
        choices as
        readonly string[]
    ).includes(value)
        ? value as T
        : null;
}


function parsePositiveInteger(
    value: string | null,
): number | undefined | null {
    if (value === null) {
        return undefined;
    }

    if (!/^\d+$/.test(value)) {
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