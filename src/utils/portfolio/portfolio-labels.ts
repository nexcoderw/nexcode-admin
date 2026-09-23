import type {
    PortfolioCategory,
    PortfolioProjectType,
    PortfolioStatus,
} from "@/types/portfolio/portfolio";

const CATEGORY_LABELS:
    Record<
        PortfolioCategory,
        string
    > = {
    web_application:
        "Web application",

    mobile_application:
        "Mobile application",

    ui_ux:
        "UI/UX",

    branding:
        "Branding",
};

const PROJECT_TYPE_LABELS:
    Record<
        PortfolioProjectType,
        string
    > = {
    client_project:
        "Client project",

    student_project:
        "Student project",

    learning_project:
        "Learning project",
};

const STATUS_LABELS:
    Record<
        PortfolioStatus,
        string
    > = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
};

export function getPortfolioCategoryLabel(
    value: PortfolioCategory,
) {
    return CATEGORY_LABELS[value];
}

export function getPortfolioProjectTypeLabel(
    value: PortfolioProjectType,
) {
    return PROJECT_TYPE_LABELS[
        value
    ];
}

export function getPortfolioStatusLabel(
    value: PortfolioStatus,
) {
    return STATUS_LABELS[value];
}

export function formatPortfolioDate(
    value: string | null,
) {
    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "—";
    }

    return (
        new Intl.DateTimeFormat(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            },
        ).format(date)
    );
}