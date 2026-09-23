import "server-only";

import {
    cookies,
    headers,
} from "next/headers";

import {
    listTeam,
} from "@/endpoints/team/list-team";
import type {
    TeamMember,
} from "@/types/team/team";
import {
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";

export interface PortfolioServerContext {
    sessionId: string;
    forwarded: Headers;
}

export async function getPortfolioServerContext():
    Promise<
        PortfolioServerContext | null
    > {
    const cookieStore =
        await cookies();

    const sessionId =
        cookieStore.get(
            ADMIN_SESSION_COOKIE_NAME,
        )?.value;

    if (!sessionId) {
        return null;
    }

    const requestHeaders =
        await headers();

    const forwarded =
        new Headers();

    requestHeaders.forEach(
        (value, key) => {
            forwarded.set(
                key,
                value,
            );
        },
    );

    return {
        sessionId,
        forwarded,
    };
}

export async function listPortfolioTeamMembers(
    context:
        PortfolioServerContext,
) {
    const items:
        TeamMember[] = [];

    let page = 1;
    let hasNext = true;

    while (hasNext) {
        const result =
            await listTeam(
                context.sessionId,
                context.forwarded,
                {
                    ordering: "name",
                    page,
                    pageSize: 100,
                },
            );

        if (
            !result.ok ||
            !result.data
        ) {
            return {
                ok: false,
                status: result.status,
                items: [],
            };
        }

        items.push(
            ...result.data.items,
        );

        hasNext =
            result.data.pagination
                .hasNext;

        page += 1;
    }

    return {
        ok: true,
        status: 200,
        items,
    };
}