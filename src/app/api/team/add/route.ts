import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    addTeamMember,
} from "@/endpoints/team/add-team-member";
import {
    sanitizeTeamFormData,
} from "@/utils/team/team-form-data";
import {
    runTeamMutation,
} from "@/utils/team/team-mutation";
import {
    noStore,
    teamAuthenticationRequired,
    teamInvalidRequest,
    teamServiceUnavailable,
} from "@/utils/team/team-responses";
import {
    getTeamRequestSession,
} from "@/utils/team/team-session";

export async function POST(
    request: NextRequest,
) {
    const session =
        getTeamRequestSession(
            request,
        );

    if (!session) {
        return teamAuthenticationRequired();
    }

    let formData: FormData;

    try {
        formData =
            sanitizeTeamFormData(
                await request.formData(),
            );
    } catch {
        return teamInvalidRequest();
    }

    const forwarded =
        new Headers(
            request.headers,
        );

    try {
        const result =
            await runTeamMutation(
                session.sessionId,
                session.csrfToken,
                forwarded,
                (csrf) =>
                    addTeamMember(
                        formData,
                        session.sessionId,
                        csrf,
                        forwarded,
                    ),
            );

        if (!result) {
            return teamServiceUnavailable();
        }

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return teamAuthenticationRequired();
        }

        if (
            result.status === 400
        ) {
            return teamInvalidRequest(
                result.fields,
            );
        }

        if (
            !result.ok ||
            !result.teamMember
        ) {
            return teamServiceUnavailable();
        }

        return noStore(
            NextResponse.json(
                {
                    success: true,
                    data: {
                        teamMember:
                            result.teamMember,
                    },
                },
                {
                    status: 201,
                },
            ),
        );
    } catch {
        return teamServiceUnavailable();
    }
}