import "server-only";

import type {
    PaymentPagination,
} from "@/types/payment/shared";

export type UnknownRecord =
    Record<string, unknown>;

export function asRecord(
    value: unknown,
): UnknownRecord | null {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    )
        ? value as UnknownRecord
        : null;
}

export function isString(
    value: unknown,
): value is string {
    return typeof value === "string";
}

export function isNullableString(
    value: unknown,
): value is string | null {
    return (
        value === null ||
        typeof value === "string"
    );
}

export function isNumber(
    value: unknown,
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );
}

export function isBoolean(
    value: unknown,
): value is boolean {
    return typeof value === "boolean";
}

export function isNullableNumber(
    value: unknown,
): value is number | null {
    return (
        value === null ||
        isNumber(value)
    );
}

export function isOneOf<
    T extends string,
>(
    value: unknown,
    values: readonly T[],
): value is T {
    return (
        typeof value === "string" &&
        values.includes(
            value as T,
        )
    );
}

export function mapPaymentPagination(
    value: unknown,
): PaymentPagination | null {
    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isNumber(item.page) ||
        !isNumber(item.page_size) ||
        !isNumber(item.total_items) ||
        !isNumber(item.total_pages) ||
        !isBoolean(item.has_next) ||
        !isBoolean(item.has_previous)
    ) {
        return null;
    }

    return {
        page: item.page,
        pageSize:
            item.page_size,
        totalItems:
            item.total_items,
        totalPages:
            item.total_pages,
        hasNext:
            item.has_next,
        hasPrevious:
            item.has_previous,
    };
}
