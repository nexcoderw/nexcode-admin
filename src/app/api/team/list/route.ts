import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    listTeam,
} from "@/endpoints/team/list-team";
import type {
    TeamListQuery,
    TeamOrdering,
} from "@/types/team/team";
import {
    getTeamRequestSession,
} from "@/utils/team/team-session";
import {
    noStore,
    teamAuthenticationRequired,
    teamInvalidRequest,
    teamServiceUnavailable,
} from "@/utils/team/team-responses";

const ORDERINGS =
    new Set<TeamOrdering>([
        "name",
        "-name",
        "position",
        "-position",
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at",
    ]);

export async function GET(
    request: NextRequest,
) {
    const session =
        getTeamRequestSession(
            request,
        );

    if (!session) {
        return teamAuthenticationRequired();
    }

    const query =
        parseQuery(request);

    if (!query) {
        return teamInvalidRequest();
    }

    try {
        const result =
            await listTeam(
                session.sessionId,
                new Headers(
                    request.headers,
                ),
                query,
            );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return teamAuthenticationRequired();
        }

        if (
            result.status === 400
        ) {
            return teamInvalidRequest();
        }

        if (
            !result.ok ||
            !result.data
        ) {
            return teamServiceUnavailable();
        }

        return noStore(
            NextResponse.json(
                {
                    success: true,
                    data: result.data,
                },
                {
                    status: 200,
                },
            ),
        );
    } catch {
        return teamServiceUnavailable();
    }
}

function parseQuery(
    request: NextRequest,
): TeamListQuery | null {
    const params =
        request.nextUrl.searchParams;

    const search =
        params.get("search")
            ?.trim() || undefined;

    const orderingValue =
        params.get("ordering");

    let ordering:
        | TeamOrdering
        | undefined;

    if (orderingValue) {
        if (
            !ORDERINGS.has(
                orderingValue as TeamOrdering,
            )
        ) {
            return null;
        }

        ordering =
            orderingValue as TeamOrdering;
    }

    const page =
        parseOptionalPositiveInteger(
            params.get("page"),
        );

    if (page === null) {
        return null;
    }

    const pageSize =
        parseOptionalPositiveInteger(
            params.get("pageSize"),
        );

    if (
        pageSize === null ||
        (
            pageSize !== undefined &&
            pageSize > 100
        )
    ) {
        return null;
    }

    return {
        search,
        ordering,
        page,
        pageSize,
    };
}

function parseOptionalPositiveInteger(
    rawValue: string | null,
): number | undefined | null {
    if (rawValue === null) {
        return undefined;
    }

    if (!/^\d+$/.test(rawValue)) {
        return null;
    }

    const value =
        Number(rawValue);

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