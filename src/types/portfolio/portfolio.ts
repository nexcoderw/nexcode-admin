export type PortfolioCategory =
    | "web_application"
    | "mobile_application"
    | "ui_ux"
    | "branding";

export type PortfolioProjectType =
    | "client_project"
    | "student_project"
    | "learning_project";

export type PortfolioStatus =
    | "draft"
    | "published"
    | "archived";

export type PortfolioOrdering =
    | "name"
    | "-name"
    | "created_at"
    | "-created_at"
    | "updated_at"
    | "-updated_at"
    | "published_at"
    | "-published_at"
    | "deadline_date"
    | "-deadline_date";

export interface PortfolioImage {
    id: number;
    image: string | null;
    altText: string;
    isCover: boolean;
    position: number;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioDocument {
    id: number;
    title: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioRepository {
    id: number;
    label: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioTeamMember {
    id: number;
    name: string | null;
    slug: string;
    position: string | null;
    image: string | null;
}

export interface PortfolioSummary {
    id: number;
    name: string;
    slug: string;
    summary: string;
    category: PortfolioCategory;
    projectType: PortfolioProjectType;
    status: PortfolioStatus;
    coverImage: PortfolioImage | null;
    teamMemberCount: number;
    projectInitiationDate: string | null;
    deadlineDate: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioDetail
    extends Omit<
        PortfolioSummary,
        "coverImage" | "teamMemberCount"
    > {
    description: string;
    liveUrl: string | null;
    figmaUrl: string | null;
    teamMembers: PortfolioTeamMember[];
    images: PortfolioImage[];
    documents: PortfolioDocument[];
    repositories: PortfolioRepository[];
}

export interface PortfolioPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PortfolioListData {
    items: PortfolioSummary[];
    pagination: PortfolioPagination;
}

export interface PortfolioListQuery {
    search?: string;
    category?: PortfolioCategory;
    projectType?: PortfolioProjectType;
    status?: PortfolioStatus;
    teamMemberId?: number;
    ordering?: PortfolioOrdering;
    page?: number;
    pageSize?: number;
}

export interface PortfolioWriteInput {
    name?: string;
    summary?: string;
    description?: string;

    category?: PortfolioCategory;

    projectType?:
    PortfolioProjectType;

    liveUrl?: string;
    figmaUrl?: string;

    teamMemberIds?: number[];

    projectInitiationDate?:
    string | null;

    deadlineDate?:
    string | null;

    status?: PortfolioStatus;
}

export interface PortfolioDocumentInput {
    title?: string;
    url?: string;
}

export interface PortfolioRepositoryInput {
    label?: string;
    url?: string;
}
