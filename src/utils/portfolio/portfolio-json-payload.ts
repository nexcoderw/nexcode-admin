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
        "category",
        "projectType",
        "liveUrl",
        "figmaUrl",
        "status",
    ] as const) {
        if (
            key in input &&
            typeof input[key] !== "string"
        ) {
            return null;
        }

        if (typeof input[key] === "string") {
            output[key] =
                input[key];
        }
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
            typeof field !== "string"
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
        if (
            key in input &&
            typeof input[key] !== "string"
        ) {
            return null;
        }

        if (typeof input[key] === "string") {
            output[key] =
                input[key];
        }
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
        if (
            key in input &&
            typeof input[key] !== "string"
        ) {
            return null;
        }

        if (typeof input[key] === "string") {
            output[key] =
                input[key];
        }
    }

    return output;
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

function isPositiveInteger(
    value: unknown,
): value is number {
    return (
        typeof value === "number" &&
        Number.isSafeInteger(value) &&
        value > 0
    );
}