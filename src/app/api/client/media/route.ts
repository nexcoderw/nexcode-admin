import type {
    NextRequest,
} from "next/server";

import {
    backendBinaryRequest,
} from "@/endpoints/client";
import {
    clientAuthenticationRequired,
} from "@/utils/client/client-responses";
import {
    getClientRequestSession,
} from "@/utils/client/client-session";


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
        getClientRequestSession(
            request,
        );

    if (!session) {
        return clientAuthenticationRequired();
    }

    const path =
        request.nextUrl
            .searchParams
            .get("path");

    if (
        !isSafeClientMediaPath(
            path,
        )
    ) {
        return mediaResponse(
            400,
        );
    }

    try {
        const result =
            await backendBinaryRequest(
                path,
            );

        if (
            result.status === 404
        ) {
            return mediaResponse(
                404,
            );
        }

        if (
            !result.ok ||
            !result.body
        ) {
            return mediaResponse(
                503,
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
            return mediaResponse(
                415,
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
        return mediaResponse(
            503,
        );
    }
}


function isSafeClientMediaPath(
    path: string | null,
): path is string {
    if (
        !path ||
        !path.startsWith(
            "/media/clients/profiles/",
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
        /^\/media\/clients\/profiles\/[A-Za-z0-9._/-]+$/
            .test(path)
    );
}


function normalizeContentType(
    value: string | null,
) {
    return value
        ?.split(";", 1)[0]
        ?.trim()
        .toLowerCase() || null;
}


function mediaResponse(
    status: number,
) {
    return new Response(
        null,
        {
            status,

            headers: {
                "Cache-Control":
                    "no-store",
            },
        },
    );
}