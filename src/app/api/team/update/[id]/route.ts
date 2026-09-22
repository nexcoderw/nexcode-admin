import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    updateTeamMember,
} from "@/endpoints/team/update-team-member";
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
    teamNotFound,
    teamServiceUnavailable,
} from "@/utils/team/team-responses";
import {
    getTeamRequestSession,
} from "@/utils/team/team-session";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext,
) {
    const session =
        getTeamRequestSession(
            request,
        );

    if (!session) {
        return teamAuthenticationRequired();
    }

    const teamId =
        await getTeamId(context);

    if (!teamId) {
        return teamInvalidRequest();
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
                    updateTeamMember(
                        teamId,
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
            result.status === 404
        ) {
            return teamNotFound();
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
            ),
        );
    } catch {
        return teamServiceUnavailable();
    }
}

async function getTeamId(
    context: RouteContext,
) {
    const { id } =
        await context.params;

    if (!/^\d+$/.test(id)) {
        return null;
    }

    const value =
        Number(id);

    return (
        Number.isSafeInteger(value) &&
            value > 0
            ? value
            : null
    );
}