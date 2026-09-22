import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    getTeamMember,
} from "@/endpoints/team/get-team-member";
import {
    getTeamRequestSession,
} from "@/utils/team/team-session";
import {
    noStore,
    teamAuthenticationRequired,
    teamInvalidRequest,
    teamNotFound,
    teamServiceUnavailable,
} from "@/utils/team/team-responses";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
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

    try {
        const result =
            await getTeamMember(
                teamId,
                session.sessionId,
                new Headers(
                    request.headers,
                ),
            );

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

    if (
        !Number.isSafeInteger(
            value,
        ) ||
        value < 1
    ) {
        return null;
    }

    return value;
}