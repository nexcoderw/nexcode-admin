import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    getClient,
} from "@/endpoints/client/get-client";
import {
    parseClientId,
} from "@/utils/client/client-id";
import {
    clientAuthenticationRequired,
    clientInvalidRequest,
    clientNotFound,
    clientServiceUnavailable,
    noStore,
} from "@/utils/client/client-responses";
import {
    getClientRequestSession,
} from "@/utils/client/client-session";


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
        getClientRequestSession(
            request,
        );

    if (!session) {
        return clientAuthenticationRequired();
    }

    const { id } =
        await context.params;

    const clientId =
        parseClientId(id);

    if (!clientId) {
        return clientInvalidRequest();
    }

    try {
        const result =
            await getClient(
                clientId,
                session.sessionId,

                new Headers(
                    request.headers,
                ),
            );

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return clientAuthenticationRequired();
        }

        if (
            result.status === 404
        ) {
            return clientNotFound();
        }

        if (
            !result.ok ||
            !result.client
        ) {
            return clientServiceUnavailable();
        }

        return noStore(
            NextResponse.json({
                success: true,

                data: {
                    client:
                        result.client,
                },
            }),
        );
    } catch {
        return clientServiceUnavailable();
    }
}