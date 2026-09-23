import type {
    PortfolioCategory,
    PortfolioOrdering,
    PortfolioProjectType,
    PortfolioStatus,
} from "@/types/portfolio/portfolio";

export const PORTFOLIO_CATEGORIES =
    [
        "web_application",
        "mobile_application",
        "ui_ux",
        "branding",
    ] as const satisfies readonly PortfolioCategory[];

export const PORTFOLIO_PROJECT_TYPES =
    [
        "client_project",
        "student_project",
        "learning_project",
    ] as const satisfies readonly PortfolioProjectType[];

export const PORTFOLIO_STATUSES =
    [
        "draft",
        "published",
        "archived",
    ] as const satisfies readonly PortfolioStatus[];

export const PORTFOLIO_ORDERINGS =
    [
        "name",
        "-name",
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at",
        "published_at",
        "-published_at",
        "deadline_date",
        "-deadline_date",
    ] as const satisfies readonly PortfolioOrdering[];