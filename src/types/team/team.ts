export interface TeamMember {
    id: number;
    name: string | null;
    slug: string;
    position: string | null;
    image: string | null;
    imagePng: string | null;
    linkedin: string | null;
    github: string | null;

    /** Lower numbers appear first, on the site and in the admin. */
    displayOrder: number;

    createdAt: string;
    updatedAt: string;
}

export interface TeamPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface TeamListData {
    items: TeamMember[];
    pagination: TeamPagination;
}

export interface TeamListQuery {
    search?: string;
    ordering?: TeamOrdering;
    page?: number;
    pageSize?: number;
}

export type TeamOrdering =
    | "display_order"
    | "-display_order"
    | "name"
    | "-name"
    | "position"
    | "-position"
    | "created_at"
    | "-created_at"
    | "updated_at"
    | "-updated_at";