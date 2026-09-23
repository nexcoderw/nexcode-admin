import "server-only";

import {
    PORTFOLIO_CATEGORIES,
    PORTFOLIO_PROJECT_TYPES,
    PORTFOLIO_STATUSES,
} from "@/constants/portfolio/portfolio-options";
import {
    asRecord,
    isBoolean,
    isChoice,
    isNullableString,
    isNumber,
    isString,
    mapArray,
} from "@/endpoints/portfolio/mapper-utils";
import {
    mapPortfolioDocument,
    mapPortfolioImage,
    mapPortfolioRepository,
    mapPortfolioTeamMember,
} from "@/endpoints/portfolio/relation-mappers";
import type {
    PortfolioCategory,
    PortfolioDetail,
    PortfolioListData,
    PortfolioPagination,
    PortfolioProjectType,
    PortfolioStatus,
    PortfolioSummary,
} from "@/types/portfolio/portfolio";

export {
    mapPortfolioDocument,
    mapPortfolioImage,
    mapPortfolioRepository,
} from "@/endpoints/portfolio/relation-mappers";

export function mapPortfolioListData(
    items: unknown,
    pagination: unknown,
): PortfolioListData | null {
    const mappedItems =
        mapArray(
            items,
            mapPortfolioSummary,
        );

    const mappedPagination =
        mapPortfolioPagination(
            pagination,
        );

    if (
        !mappedItems ||
        !mappedPagination
    ) {
        return null;
    }

    return {
        items: mappedItems,
        pagination:
            mappedPagination,
    };
}

export function mapPortfolioSummary(
    value: unknown,
): PortfolioSummary | null {
    const item =
        asRecord(value);

    if (!item) {
        return null;
    }

    const category =
        mapCategory(
            item.category,
        );

    const projectType =
        mapProjectType(
            item.project_type,
        );

    const status =
        mapStatus(
            item.status,
        );

    const coverImage =
        item.cover_image === null
            ? null
            : mapPortfolioImage(
                item.cover_image,
            );

    if (
        !isNumber(item.id) ||
        !isString(item.name) ||
        !isString(item.slug) ||
        !isString(item.summary) ||
        !category ||
        !projectType ||
        !status ||
        !isNumber(
            item.team_member_count,
        ) ||
        !isNullableString(
            item.project_initiation_date,
        ) ||
        !isNullableString(
            item.deadline_date,
        ) ||
        !isNullableString(
            item.published_at,
        ) ||
        !isString(
            item.created_at,
        ) ||
        !isString(
            item.updated_at,
        ) ||
        (
            item.cover_image !==
                null &&
            !coverImage
        )
    ) {
        return null;
    }

    return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        summary: item.summary,
        category,
        projectType,
        status,
        coverImage,
        teamMemberCount:
            item.team_member_count,
        projectInitiationDate:
            item.project_initiation_date,
        deadlineDate:
            item.deadline_date,
        publishedAt:
            item.published_at,
        createdAt:
            item.created_at,
        updatedAt:
            item.updated_at,
    };
}

export function mapPortfolioDetail(
    value: unknown,
): PortfolioDetail | null {
    const item =
        asRecord(value);

    if (!item) {
        return null;
    }

    const category =
        mapCategory(
            item.category,
        );

    const projectType =
        mapProjectType(
            item.project_type,
        );

    const status =
        mapStatus(
            item.status,
        );

    const teamMembers =
        mapArray(
            item.team_members,
            mapPortfolioTeamMember,
        );

    const images =
        mapArray(
            item.images,
            mapPortfolioImage,
        );

    const documents =
        mapArray(
            item.documents,
            mapPortfolioDocument,
        );

    const repositories =
        mapArray(
            item.repositories,
            mapPortfolioRepository,
        );

    if (
        !isNumber(item.id) ||
        !isString(item.name) ||
        !isString(item.slug) ||
        !isString(item.summary) ||
        !isString(
            item.description,
        ) ||
        !category ||
        !projectType ||
        !status ||
        !isNullableString(
            item.live_url,
        ) ||
        !isNullableString(
            item.figma_url,
        ) ||
        !isNullableString(
            item.project_initiation_date,
        ) ||
        !isNullableString(
            item.deadline_date,
        ) ||
        !isNullableString(
            item.published_at,
        ) ||
        !isString(
            item.created_at,
        ) ||
        !isString(
            item.updated_at,
        ) ||
        !teamMembers ||
        !images ||
        !documents ||
        !repositories
    ) {
        return null;
    }

    return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        summary: item.summary,
        description:
            item.description,
        category,
        projectType,
        liveUrl:
            item.live_url,
        figmaUrl:
            item.figma_url,
        projectInitiationDate:
            item.project_initiation_date,
        deadlineDate:
            item.deadline_date,
        status,
        publishedAt:
            item.published_at,
        teamMembers,
        images,
        documents,
        repositories,
        createdAt:
            item.created_at,
        updatedAt:
            item.updated_at,
    };
}

function mapPortfolioPagination(
    value: unknown,
): PortfolioPagination | null {
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

function mapCategory(
    value: unknown,
): PortfolioCategory | null {
    return isChoice(
        value,
        PORTFOLIO_CATEGORIES,
    )
        ? value
        : null;
}

function mapProjectType(
    value: unknown,
): PortfolioProjectType | null {
    return isChoice(
        value,
        PORTFOLIO_PROJECT_TYPES,
    )
        ? value
        : null;
}

function mapStatus(
    value: unknown,
): PortfolioStatus | null {
    return isChoice(
        value,
        PORTFOLIO_STATUSES,
    )
        ? value
        : null;
}