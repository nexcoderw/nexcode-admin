import "server-only";

import type {
    TeamListData,
    TeamMember,
} from "@/types/team/team";

export interface TeamListResult {
    ok: boolean;
    status: number;
    data: TeamListData | null;
}

export interface TeamMemberResult {
    ok: boolean;
    status: number;
    teamMember: TeamMember | null;
    fields: string[];
}

export interface TeamDeleteResult {
    ok: boolean;
    status: number;
}

export interface TeamMutationCsrf {
    cookie: string;
    token: string;
}