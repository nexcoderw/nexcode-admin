import "server-only";

import type {
    PortfolioDocumentInput,
    PortfolioRepositoryInput,
    PortfolioWriteInput,
} from "@/types/portfolio/portfolio";

export function toBackendPortfolioPayload(
    input: PortfolioWriteInput,
) {
    const payload:
        Record<string, unknown> = {};

    copy(
        payload,
        "name",
        input.name,
    );

    copy(
        payload,
        "summary",
        input.summary,
    );

    copy(
        payload,
        "description",
        input.description,
    );

    copy(
        payload,
        "category",
        input.category,
    );

    copy(
        payload,
        "project_type",
        input.projectType,
    );

    copy(
        payload,
        "live_url",
        input.liveUrl,
    );

    copy(
        payload,
        "figma_url",
        input.figmaUrl,
    );

    copy(
        payload,
        "team_member_ids",
        input.teamMemberIds,
    );

    copy(
        payload,
        "project_initiation_date",
        input.projectInitiationDate,
    );

    copy(
        payload,
        "deadline_date",
        input.deadlineDate,
    );

    copy(
        payload,
        "status",
        input.status,
    );

    return payload;
}

export function toBackendDocumentPayload(
    input: PortfolioDocumentInput,
) {
    const payload:
        Record<string, unknown> = {};

    copy(
        payload,
        "title",
        input.title,
    );

    copy(
        payload,
        "url",
        input.url,
    );

    return payload;
}

export function toBackendRepositoryPayload(
    input: PortfolioRepositoryInput,
) {
    const payload:
        Record<string, unknown> = {};

    copy(
        payload,
        "label",
        input.label,
    );

    copy(
        payload,
        "url",
        input.url,
    );

    return payload;
}

function copy(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
) {
    if (value !== undefined) {
        target[key] = value;
    }
}