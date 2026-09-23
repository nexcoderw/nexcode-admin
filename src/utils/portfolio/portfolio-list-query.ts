import {
    PORTFOLIO_CATEGORIES,
    PORTFOLIO_ORDERINGS,
    PORTFOLIO_PROJECT_TYPES,
    PORTFOLIO_STATUSES,
} from "@/constants/portfolio/portfolio-options";
import type {
    PortfolioCategory,
    PortfolioListQuery,
    PortfolioOrdering,
    PortfolioProjectType,
    PortfolioStatus,
} from "@/types/portfolio/portfolio";

export function parsePortfolioListQuery(
    params: URLSearchParams,
): PortfolioListQuery | null {
    const category =
        parseChoice(
            params.get("category"),
            PORTFOLIO_CATEGORIES,
        );

    const projectType =
        parseChoice(
            params.get("projectType"),
            PORTFOLIO_PROJECT_TYPES,
        );

    const status =
        parseChoice(
            params.get("status"),
            PORTFOLIO_STATUSES,
        );

    const ordering =
        parseChoice(
            params.get("ordering"),
            PORTFOLIO_ORDERINGS,
        );

    if (
        category === null ||
        projectType === null ||
        status === null ||
        ordering === null
    ) {
        return null;
    }

    const teamMemberId =
        parsePositiveInteger(
            params.get(
                "teamMemberId",
            ),
        );

    const page =
        parsePositiveInteger(
            params.get("page"),
        );

    const pageSize =
        parsePositiveInteger(
            params.get("pageSize"),
        );

    if (
        teamMemberId === null ||
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
        category:
            category as
            | PortfolioCategory
            | undefined,
        projectType:
            projectType as
            | PortfolioProjectType
            | undefined,
        status:
            status as
            | PortfolioStatus
            | undefined,
        teamMemberId,
        ordering:
            ordering as
            | PortfolioOrdering
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