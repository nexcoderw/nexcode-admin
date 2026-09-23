import {
    PORTFOLIO_CATEGORIES,
    PORTFOLIO_PROJECT_TYPES,
    PORTFOLIO_STATUSES,
} from "@/constants/portfolio/portfolio-options";
import type {
    PortfolioDocumentInput,
    PortfolioRepositoryInput,
    PortfolioWriteInput,
} from "@/types/portfolio/portfolio";

type UnknownRecord =
    Record<string, unknown>;

export function sanitizePortfolioPayload(
    value: unknown,
): PortfolioWriteInput | null {
    const input =
        asRecord(value);

    if (!input) {
        return null;
    }

    const output:
        PortfolioWriteInput = {};

    for (const key of [
        "name",
        "summary",
        "description",
        "liveUrl",
        "figmaUrl",
    ] as const) {
        if (!(key in input)) {
            continue;
        }

        const field =
            input[key];

        if (
            typeof field !==
            "string"
        ) {
            return null;
        }

        output[key] = field;
    }

    const category =
        readChoice(
            input,
            "category",
            PORTFOLIO_CATEGORIES,
        );

    if (category === null) {
        return null;
    }

    if (category !== undefined) {
        output.category =
            category;
    }

    const projectType =
        readChoice(
            input,
            "projectType",
            PORTFOLIO_PROJECT_TYPES,
        );

    if (projectType === null) {
        return null;
    }

    if (
        projectType !== undefined
    ) {
        output.projectType =
            projectType;
    }

    const status =
        readChoice(
            input,
            "status",
            PORTFOLIO_STATUSES,
        );

    if (status === null) {
        return null;
    }

    if (status !== undefined) {
        output.status =
            status;
    }

    for (const key of [
        "projectInitiationDate",
        "deadlineDate",
    ] as const) {
        if (!(key in input)) {
            continue;
        }

        const field =
            input[key];

        if (
            field !== null &&
            typeof field !==
            "string"
        ) {
            return null;
        }

        output[key] = field;
    }

    if (
        "teamMemberIds"
        in input
    ) {
        if (
            !Array.isArray(
                input.teamMemberIds,
            ) ||
            !input.teamMemberIds.every(
                isPositiveInteger,
            )
        ) {
            return null;
        }

        output.teamMemberIds =
            input.teamMemberIds;
    }

    return output;
}

export function sanitizePortfolioDocumentPayload(
    value: unknown,
): PortfolioDocumentInput | null {
    const input =
        asRecord(value);

    if (!input) {
        return null;
    }

    const output:
        PortfolioDocumentInput = {};

    for (const key of [
        "title",
        "url",
    ] as const) {
        if (!(key in input)) {
            continue;
        }

        const field =
            input[key];

        if (
            typeof field !==
            "string"
        ) {
            return null;
        }

        output[key] = field;
    }

    return output;
}

export function sanitizePortfolioRepositoryPayload(
    value: unknown,
): PortfolioRepositoryInput | null {
    const input =
        asRecord(value);

    if (!input) {
        return null;
    }

    const output:
        PortfolioRepositoryInput = {};

    for (const key of [
        "label",
        "url",
    ] as const) {
        if (!(key in input)) {
            continue;
        }

        const field =
            input[key];

        if (
            typeof field !==
            "string"
        ) {
            return null;
        }

        output[key] = field;
    }

    return output;
}

function readChoice<
    T extends string,
>(
    input: UnknownRecord,
    key: string,
    choices: readonly T[],
): T | undefined | null {
    if (!(key in input)) {
        return undefined;
    }

    const value =
        input[key];

    if (
        typeof value !==
        "string"
    ) {
        return null;
    }

    if (
        !(
            choices as
            readonly string[]
        ).includes(value)
    ) {
        return null;
    }

    return value as T;
}

function asRecord(
    value: unknown,
): UnknownRecord | null {
    return (
        value &&
        typeof value ===
        "object" &&
        !Array.isArray(value)
    )
        ? value as UnknownRecord
        : null;
}

function isPositiveInteger(
    value: unknown,
): value is number {
    return (
        typeof value ===
        "number" &&
        Number.isSafeInteger(
            value,
        ) &&
        value > 0
    );
}