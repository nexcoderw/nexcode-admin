import "server-only";

import {
    CLIENT_STATUSES,
} from "@/constants/client/client-options";
import type {
    ClientDetail,
    ClientListData,
    ClientPagination,
    ClientStatus,
    ClientSummary,
} from "@/types/client/client";


type UnknownRecord =
    Record<string, unknown>;


export function mapClientSummary(
    value: unknown,
): ClientSummary | null {
    const item =
        asRecord(value);

    if (!item) {
        return null;
    }

    const status =
        mapStatus(
            item.status,
        );

    if (
        !isNumber(item.id) ||
        !isString(item.name) ||
        !isString(item.slug) ||
        !isString(
            item.company_name,
        ) ||
        !isNullableString(
            item.email,
        ) ||
        !isNullableString(
            item.phone,
        ) ||
        !isNullableString(
            item.location,
        ) ||
        !isNullableString(
            item.profile_image,
        ) ||
        !status ||
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
        slug: item.slug,

        companyName:
            item.company_name,

        email: item.email,
        phone: item.phone,
        location: item.location,

        profileImage:
            item.profile_image,

        status,

        createdAt:
            item.created_at,

        updatedAt:
            item.updated_at,
    };
}


export function mapClientDetail(
    value: unknown,
): ClientDetail | null {
    const item =
        asRecord(value);

    const summary =
        mapClientSummary(value);

    if (
        !item ||
        !summary ||
        !isNullableString(
            item.website,
        ) ||
        !isString(
            item.notes,
        )
    ) {
        return null;
    }

    return {
        ...summary,
        website:
            item.website,
        notes:
            item.notes,
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
        ClientSummary[] = [];

    for (const item of items) {
        const mapped =
            mapClientSummary(
                item,
            );

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


function mapStatus(
    value: unknown,
): ClientStatus | null {
    if (
        typeof value !== "string" ||
        !(
            CLIENT_STATUSES as
            readonly string[]
        ).includes(value)
    ) {
        return null;
    }

    return value as ClientStatus;
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