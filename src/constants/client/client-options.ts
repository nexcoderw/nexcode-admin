import type {
    ClientOrdering,
} from "@/types/client/client";


export const CLIENT_ORDERINGS = [
    "name",
    "-name",
    "created_at",
    "-created_at",
    "updated_at",
    "-updated_at",
] as const satisfies readonly ClientOrdering[];
