import "server-only";

import type {
    Client,
    ClientListData,
    ClientPagination,
} from "@/types/client/client";

type UnknownRecord =
    Record<string, unknown>;

export function mapClient(
    value: unknown,
): Client | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.id) ||
        !isString(item.name) ||
        !isNullableString(
            item.email,
        ) ||
        !isNullableString(
            item.phone_number,
        ) ||
        !isString(
            item.created_at,
        ) ||
        !isString(
            item.updated_at,
        )
    ) {
        return null;
    }

    return {
        id: item.id,
        name: item.name,
        email: item.email,
        phoneNumber:
            item.phone_number,
        createdAt:
            item.created_at,
        updatedAt:
            item.updated_at,
    };
}

export function mapClientListData(
    items: unknown,
    pagination: unknown,
): ClientListData | null {
    if (!Array.isArray(items)) {
        return null;
    }

    const mappedItems:
        Client[] = [];

    for (const item of items) {
        const mapped =
            mapClient(item);

        if (!mapped) {
            return null;
        }

        mappedItems.push(
            mapped,
        );
    }

    const mappedPagination =
        mapPagination(
            pagination,
        );

    if (!mappedPagination) {
        return null;
    }

    return {
        items: mappedItems,
        pagination:
            mappedPagination,
    };
}

function mapPagination(
    value: unknown,
): ClientPagination | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.page) ||
        !isNumber(
            item.page_size,
        ) ||
        !isNumber(
            item.total_items,
        ) ||
        !isNumber(
            item.total_pages,
        ) ||
        !isBoolean(
            item.has_next,
        ) ||
        !isBoolean(
            item.has_previous,
        )
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

function asRecord(
    value: unknown,
): UnknownRecord | null {
    return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    )
        ? value as UnknownRecord
        : null;
}

function isString(
    value: unknown,
): value is string {
    return (
        typeof value === "string"
    );
}

function isNullableString(
    value: unknown,
): value is string | null {
    return (
        value === null ||
        typeof value === "string"
    );
}

function isNumber(
    value: unknown,
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );
}

function isBoolean(
    value: unknown,
): value is boolean {
    return (
        typeof value === "boolean"
    );
}
