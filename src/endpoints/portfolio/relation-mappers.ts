import "server-only";

import {
    asRecord,
    isBoolean,
    isNullableString,
    isNumber,
    isString,
} from "@/endpoints/portfolio/mapper-utils";
import type {
    PortfolioDocument,
    PortfolioImage,
    PortfolioRepository,
    PortfolioTeamMember,
} from "@/types/portfolio/portfolio";

export function mapPortfolioImage(
    value: unknown,
): PortfolioImage | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.id) ||
        !isNullableString(
            item.image,
        ) ||
        !isString(
            item.alt_text,
        ) ||
        !isBoolean(
            item.is_cover,
        ) ||
        !isNumber(
            item.position,
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
        image: item.image,
        altText:
            item.alt_text,
        isCover:
            item.is_cover,
        position:
            item.position,
        createdAt:
            item.created_at,
        updatedAt:
            item.updated_at,
    };
}

export function mapPortfolioDocument(
    value: unknown,
): PortfolioDocument | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.id) ||
        !isString(
            item.title,
        ) ||
        !isString(
            item.url,
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
        title: item.title,
        url: item.url,
        createdAt:
            item.created_at,
        updatedAt:
            item.updated_at,
    };
}

export function mapPortfolioRepository(
    value: unknown,
): PortfolioRepository | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.id) ||
        !isString(
            item.label,
        ) ||
        !isString(
            item.url,
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
        label: item.label,
        url: item.url,
        createdAt:
            item.created_at,
        updatedAt:
            item.updated_at,
    };
}

export function mapPortfolioTeamMember(
    value: unknown,
): PortfolioTeamMember | null {
    const item =
        asRecord(value);

    if (
        !item ||
        !isNumber(item.id) ||
        !isNullableString(
            item.name,
        ) ||
        !isString(
            item.slug,
        ) ||
        !isNullableString(
            item.position,
        ) ||
        !isNullableString(
            item.image,
        )
    ) {
        return null;
    }

    return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        position:
            item.position,
        image: item.image,
    };
}