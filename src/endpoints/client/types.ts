import "server-only";

import type {
    Client,
    ClientListData,
} from "@/types/client/client";


export interface ClientListResult {
    ok: boolean;
    status: number;
    data: ClientListData | null;
}

export interface ClientDetailResult {
    ok: boolean;
    status: number;
    client: Client | null;
}

export interface ClientMutationResult {
    ok: boolean;
    status: number;
    client: Client | null;
    fields: string[];
}

export interface ClientDeleteResult {
    ok: boolean;
    status: number;
}

export interface ClientMutationCsrf {
    cookie: string;
    token: string;
}
