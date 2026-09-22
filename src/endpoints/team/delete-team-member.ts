import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import type {
    TeamDeleteResult,
    TeamMutationCsrf,
} from "@/endpoints/team/types";

export async function deleteTeamMember(
    teamId: number,
    sessionId: string,
    csrf: TeamMutationCsrf,
    forwarded: Headers,
): Promise<TeamDeleteResult> {
    const result =
        await backendRequest<null>(
            `/api/admin/team/delete/${teamId}/`,
            {
                method: "DELETE",
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
            },
        );

    return {
        ok: result.ok,
        status: result.status,
    };
}