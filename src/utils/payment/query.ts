import {
    PAYMENT_MAX_PAGE_SIZE,
} from "@/constants/payment/payment-query";

/*
 * Shared parsing for the payment list routes' search params. Each reader
 * returns undefined when the parameter is absent, the parsed value when
 * it is valid, and INVALID when it is present but malformed, so a route
 * rejects a bad request rather than silently dropping a filter.
 */

export const INVALID =
    Symbol("invalid");

export type QueryValue<T> =
    | T
    | undefined
    | typeof INVALID;

export interface PaymentPageQuery {
    page?: number;
    pageSize?: number;
}

export function readPositiveInt(
    params: URLSearchParams,
    key: string,
): QueryValue<number> {
    const value =
        params.get(key);

    if (!value) {
        return undefined;
    }

    const parsed =
        Number(value);

    return (
        Number.isInteger(parsed) &&
        parsed > 0
    )
        ? parsed
        : INVALID;
}

export function readChoice<
    T extends string,
>(
    params: URLSearchParams,
    key: string,
    choices: readonly T[],
): QueryValue<T> {
    const value =
        params.get(key);

    if (!value) {
        return undefined;
    }

    return (
        choices as
        readonly string[]
    ).includes(value)
        ? value as T
        : INVALID;
}

export function readBoolean(
    params: URLSearchParams,
    key: string,
): QueryValue<boolean> {
    const value =
        params.get(key);

    if (!value) {
        return undefined;
    }

    if (value === "true") {
        return true;
    }

    return value === "false"
        ? false
        : INVALID;
}

/**
 * A real calendar date in YYYY-MM-DD form, as the backend's date
 * filters expect.
 */
export function readDate(
    params: URLSearchParams,
    key: string,
): QueryValue<string> {
    const value =
        params.get(key);

    if (!value) {
        return undefined;
    }

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            value,
        )
    ) {
        return INVALID;
    }

    const date =
        new Date(
            `${value}T00:00:00Z`,
        );

    // Rejects dates that roll over, such as 2026-02-30.
    return (
        !Number.isNaN(
            date.getTime(),
        ) &&
        date.toISOString()
            .startsWith(value)
    )
        ? value
        : INVALID;
}

export function readPage(
    params: URLSearchParams,
): PaymentPageQuery | typeof INVALID {
    const page =
        readPositiveInt(
            params,
            "page",
        );

    const pageSize =
        readPositiveInt(
            params,
            "pageSize",
        );

    if (
        page === INVALID ||
        pageSize === INVALID ||
        (
            pageSize !== undefined &&
            pageSize >
            PAYMENT_MAX_PAGE_SIZE
        )
    ) {
        return INVALID;
    }

    return {
        page,
        pageSize,
    };
}

/**
 * Whether any value read from the query was malformed.
 */
export function hasInvalid(
    values: readonly unknown[],
) {
    return values.includes(
        INVALID,
    );
}
