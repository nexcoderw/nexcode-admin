import "server-only";

import type {
    Contact,
    ContactListData,
} from "@/types/contact/contact";


export interface ContactListResult {
    ok: boolean;
    status: number;
    data: ContactListData | null;
}

export interface ContactReplyResult {
    ok: boolean;
    status: number;
    contact: Contact | null;
    fields: string[];
}

export interface ContactMutationCsrf {
    cookie: string;
    token: string;
}
