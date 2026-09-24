import "server-only";

import {
    CONTACT_DEVICE_TYPES,
} from "@/constants/contact/contact-options";
import type {
    Contact,
    ContactDeviceType,
    ContactListData,
    ContactPagination,
} from "@/types/contact/contact";

type UnknownRecord =
    Record<string, unknown>;

export function mapContact(
    value: unknown,
): Contact | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.id) ||
        !isString(item.name) ||
        !isString(item.email) ||
        !isString(item.subject) ||
        !isString(item.message) ||
        !isNullableString(item.ip_address) ||
        !isNullableString(item.user_agent) ||
        !isDeviceType(item.device_type) ||
        !isNullableString(item.browser) ||
        !isNullableString(
            item.operating_system,
        ) ||
        !isNullableString(item.replied_at) ||
        !isString(item.created_at)
    ) {
        return null;
    }

    return {
        id: item.id,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        ipAddress: item.ip_address,
        userAgent: item.user_agent,
        deviceType: item.device_type,
        browser: item.browser,
        operatingSystem:
            item.operating_system,
        repliedAt: item.replied_at,
        createdAt: item.created_at,
    };
}

export function mapContactListData(
    value: unknown,
): ContactListData | null {
    const data =
        asRecord(value);

    if (
        !data ||
        !Array.isArray(data.items) ||
        !isNumber(data.unanswered)
    ) {
        return null;
    }

    const items:
        Contact[] = [];

    for (const item of data.items) {
        const mapped =
            mapContact(item);

        if (!mapped) {
            return null;
        }

        items.push(mapped);
    }

    const pagination =
        mapPagination(
            data.pagination,
        );

    if (!pagination) {
        return null;
    }

    return {
        items,
        pagination,
        unanswered:
            data.unanswered,
    };
}

function mapPagination(
    value: unknown,
): ContactPagination | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.page) ||
        !isNumber(item.page_size) ||
        !isNumber(item.total_items) ||
        !isNumber(item.total_pages) ||
        typeof item.has_next !== "boolean" ||
        typeof item.has_previous !== "boolean"
    ) {
        return null;
    }

    return {
        page: item.page,
        pageSize: item.page_size,
        totalItems: item.total_items,
        totalPages: item.total_pages,
        hasNext: item.has_next,
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
    return typeof value === "string";
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

function isDeviceType(
    value: unknown,
): value is ContactDeviceType {
    return (
        CONTACT_DEVICE_TYPES as
        readonly unknown[]
    ).includes(value);
}
