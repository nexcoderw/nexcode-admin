export type ClientOrdering =
    | "name"
    | "-name"
    | "created_at"
    | "-created_at"
    | "updated_at"
    | "-updated_at";

export interface Client {
    id: number;
    name: string;

    email: string | null;
    phoneNumber: string | null;

    createdAt: string;
    updatedAt: string;
}

/**
 * The editable fields of a client. On update, a field left undefined is
 * not sent and keeps its stored value; an empty string clears it.
 */
export interface ClientInput {
    name?: string;
    email?: string;
    phoneNumber?: string;
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
    items: Client[];
    pagination: ClientPagination;
}

export interface ClientListQuery {
    search?: string;
    ordering?: ClientOrdering;
    page?: number;
    pageSize?: number;
}
