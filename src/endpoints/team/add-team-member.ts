import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapTeamMember,
} from "@/endpoints/team/mapper";
import {
    getTeamErrorFields,
} from "@/endpoints/team/mutation-errors";
import type {
    TeamMemberResult,
    TeamMutationCsrf,
} from "@/endpoints/team/types";

interface BackendAddResponse {
    status: "success";
    message: string;
    data: {
        team_member: unknown;
    };
}

export async function addTeamMember(
    formData: FormData,
    sessionId: string,
    csrf: TeamMutationCsrf,
    forwarded: Headers,
): Promise<TeamMemberResult> {
    const result =
        await backendRequest<BackendAddResponse>(
            "/api/admin/team/add/",
            {
                method: "POST",
                forwarded,
                headers: {
                    Cookie: [
                        `sessionid=${encodeURIComponent(
                            sessionId,
                        )}`,
                        `csrftoken=${encodeURIComponent(
                            csrf.cookie,
                        )}`,
                    ].join("; "),

                    "X-CSRFToken":
                        csrf.token,
                },
                formData,
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            teamMember: null,
            fields:
                getTeamErrorFields(
                    result.data,
                ),
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