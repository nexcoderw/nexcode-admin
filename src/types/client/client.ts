export type ClientStatus =
    | "active"
    | "inactive"
    | "archived";

export type ClientOrdering =
    | "name"
    | "-name"
    | "company_name"
    | "-company_name"
    | "status"
    | "-status"
    | "created_at"
    | "-created_at"
    | "updated_at"
    | "-updated_at";

export interface ClientSummary {
    id: number;
    name: string;
    slug: string;

    companyName: string;

    email: string | null;
    phone: string | null;
    location: string | null;

    profileImage: string | null;

    status: ClientStatus;

    createdAt: string;
    updatedAt: string;
}

export interface ClientDetail
    extends ClientSummary {
    website: string | null;
    notes: string;
}

export interface ClientPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ClientListData {
    items: ClientSummary[];
    pagination: ClientPagination;
}

export interface ClientListQuery {
    search?: string;
    status?: ClientStatus;
    ordering?: ClientOrdering;
    page?: number;
    pageSize?: number;
}