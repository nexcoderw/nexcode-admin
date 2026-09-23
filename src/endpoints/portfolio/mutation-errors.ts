import "server-only";

const PORTFOLIO_FIELDS = {
    name: "name",
    summary: "summary",
    description: "description",
    category: "category",
    project_type: "projectType",
    live_url: "liveUrl",
    figma_url: "figmaUrl",
    team_member_ids: "teamMemberIds",
    project_initiation_date:
        "projectInitiationDate",
    deadline_date:
        "deadlineDate",
    status: "status",
    __all__: "__all__",
} as const;

const IMAGE_FIELDS = {
    image: "image",
    alt_text: "altText",
    is_cover: "isCover",
    position: "position",
    __all__: "__all__",
} as const;

const DOCUMENT_FIELDS = {
    title: "title",
    url: "url",
    __all__: "__all__",
} as const;

const REPOSITORY_FIELDS = {
    label: "label",
    url: "url",
    __all__: "__all__",
} as const;

export function getPortfolioErrorFields(
    value: unknown,
) {
    return mapFields(
        value,
        PORTFOLIO_FIELDS,
    );
}

export function getPortfolioImageErrorFields(
    value: unknown,
) {
    return mapFields(
        value,
        IMAGE_FIELDS,
    );
}

export function getPortfolioDocumentErrorFields(
    value: unknown,
) {
    return mapFields(
        value,
        DOCUMENT_FIELDS,
    );
}

export function getPortfolioRepositoryErrorFields(
    value: unknown,
) {
    return mapFields(
        value,
        REPOSITORY_FIELDS,
    );
}

function mapFields(
    value: unknown,
    fieldMap: Record<
        string,
        string
    >,
) {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return [];
    }

    const errors =
        (
            value as {
                errors?: unknown;
            }
        ).errors;

    if (
        !errors ||
        typeof errors !== "object" ||
        Array.isArray(errors)
    ) {
        return [];
    }

    return Object.keys(
        errors,
    )
        .map(
            (field) =>
                fieldMap[field],
        )
        .filter(
            (
                field,
            ): field is string =>
                Boolean(field),
        );
}