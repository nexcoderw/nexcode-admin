import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapTeamMember,
} from "@/endpoints/team/mapper";
import type {
    TeamMemberResult,
} from "@/endpoints/team/types";

interface BackendDetailResponse {
    status: "success";
    data: {
        team_member: unknown;
    };
}

export async function getTeamMember(
    teamId: number,
    sessionId: string,
    forwarded: Headers,
): Promise<TeamMemberResult> {
    const result =
        await backendRequest<BackendDetailResponse>(
            `/api/admin/team/detail/${teamId}/`,
            {
                method: "GET",
                forwarded,
                headers: {
                    Cookie:
                        `sessionid=${encodeURIComponent(
                            sessionId,
                        )}`,
                },
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            teamMember: null,
            fields: [],
        };
    }

    const teamMember =
        mapTeamMember(
            result.data?.data
                ?.team_member,
        );

    if (!teamMember) {
        return {
            ok: false,
            status: 502,
            teamMember: null,
            fields: [],
        };
    }

    return {
        ok: true,
        status: result.status,
        teamMember,
        fields: [],
    };
}