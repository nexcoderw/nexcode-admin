import "server-only";

import type {
    TeamListData,
    TeamMember,
    TeamPagination,
} from "@/types/team/team";

export interface BackendTeamMember {
    id: number;
    name: string | null;
    slug: string;
    position: string | null;
    image: string | null;
    image_png: string | null;
    linkedin: string | null;
    github: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface BackendTeamPagination {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

export function mapTeamMember(
    value: unknown,
): TeamMember | null {
    if (!isBackendTeamMember(value)) {
        return null;
    }

    return {
        id: value.id,
        name: value.name,
        slug: value.slug,
        position: value.position,
        image: value.image,
        imagePng: value.image_png,
        linkedin: value.linkedin,
        github: value.github,
        displayOrder: value.display_order,
        createdAt: value.created_at,
        updatedAt: value.updated_at,
    };
}

export function mapTeamListData(
    items: unknown,
    pagination: unknown,
): TeamListData | null {
    if (
        !Array.isArray(items) ||
        !isBackendPagination(
            pagination,
        )
    ) {
        return null;
    }

    const mappedItems: TeamMember[] =
        [];

    for (const item of items) {
        const mapped =
            mapTeamMember(item);

        if (!mapped) {
            return null;
        }

        mappedItems.push(mapped);
    }

    return {
        items: mappedItems,
        pagination:
            mapPagination(
                pagination,
            ),
    };
}

function mapPagination(
    value: BackendTeamPagination,
): TeamPagination {
    return {
        page: value.page,
        pageSize: value.page_size,
        totalItems:
            value.total_items,
        totalPages:
            value.total_pages,
        hasNext: value.has_next,
        hasPrevious:
            value.has_previous,
    };
}

function isBackendTeamMember(
    value: unknown,
): value is BackendTeamMember {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return false;
    }

    const member =
        value as Partial<BackendTeamMember>;

    return (
        typeof member.id === "number" &&
        isNullableString(
            member.name,
        ) &&
        typeof member.slug ===
        "string" &&
        isNullableString(
            member.position,
        ) &&
        isNullableString(
            member.image,
        ) &&
        isNullableString(
            member.image_png,
        ) &&
        isNullableString(
            member.linkedin,
        ) &&
        isNullableString(
            member.github,
        ) &&
        typeof member.display_order ===
        "number" &&
        typeof member.created_at ===
        "string" &&
        typeof member.updated_at ===
        "string"
    );
}

function isBackendPagination(
    value: unknown,
): value is BackendTeamPagination {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return false;
    }

    const pagination =
        value as Partial<BackendTeamPagination>;

    return (
        typeof pagination.page ===
        "number" &&
        typeof pagination.page_size ===
        "number" &&
        typeof pagination.total_items ===
        "number" &&
        typeof pagination.total_pages ===
        "number" &&
        typeof pagination.has_next ===
        "boolean" &&
        typeof pagination.has_previous ===
        "boolean"
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