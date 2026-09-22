import {
    type NextRequest,
} from "next/server";

import {
    backendBinaryRequest,
} from "@/endpoints/client";
import {
    teamAuthenticationRequired,
} from "@/utils/team/team-responses";
import {
    getTeamRequestSession,
} from "@/utils/team/team-session";

const ALLOWED_CONTENT_TYPES =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
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

    const path =
        request.nextUrl.searchParams
            .get("path");

    if (!isSafeTeamMediaPath(path)) {
        return new Response(
            null,
            {
                status: 400,
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            },
        );
    }

    try {
        const result =
            await backendBinaryRequest(
                path,
            );

        if (result.status === 404) {
            return new Response(
                null,
                {
                    status: 404,
                    headers: {
                        "Cache-Control":
                            "no-store",
                    },
                },
            );
        }

        if (
            !result.ok ||
            !result.body
        ) {
            return new Response(
                null,
                {
                    status: 503,
                    headers: {
                        "Cache-Control":
                            "no-store",
                    },
                },
            );
        }

        const contentType =
            normalizeContentType(
                result.contentType,
            );

        if (
            !contentType ||
            !ALLOWED_CONTENT_TYPES.has(
                contentType,
            )
        ) {
            return new Response(
                null,
                {
                    status: 415,
                    headers: {
                        "Cache-Control":
                            "no-store",
                    },
                },
            );
        }

        return new Response(
            result.body,
            {
                status: 200,
                headers: {
                    "Content-Type":
                        contentType,

                    "Cache-Control":
                        "private, no-store",

                    "X-Content-Type-Options":
                        "nosniff",
                },
            },
        );
    } catch {
        return new Response(
            null,
            {
                status: 503,
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            },
        );
    }
}

function isSafeTeamMediaPath(
    path: string | null,
): path is string {
    if (
        !path ||
        !path.startsWith(
            "/media/team/",
        )
    ) {
        return false;
    }

    if (
        path.includes("..") ||
        path.includes("\\") ||
        path.includes("://")
    ) {
        return false;
    }

    return (
        /^\/media\/team\/[A-Za-z0-9._/-]+$/
            .test(path)
    );
}

function normalizeContentType(
    value: string | null,
) {
    if (!value) {
        return null;
    }

    return (
        value
            .split(";", 1)[0]
            ?.trim()
            .toLowerCase() ||
        null
    );
}