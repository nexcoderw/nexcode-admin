import type {
    ClientOrdering,
    ClientStatus,
} from "@/types/client/client";


export const CLIENT_STATUSES = [
    "active",
    "inactive",
    "archived",
] as const satisfies readonly ClientStatus[];

export const CLIENT_ORDERINGS = [
    "name",
    "-name",
    "company_name",
    "-company_name",
    "status",
    "-status",
    "created_at",
    "-created_at",
    "updated_at",
    "-updated_at",
] as const satisfies readonly ClientOrdering[];