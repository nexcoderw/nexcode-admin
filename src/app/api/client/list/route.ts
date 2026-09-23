import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    listClients,
} from "@/endpoints/client/list-clients";
import {
    parseClientListQuery,
} from "@/utils/client/client-list-query";
import {
    clientAuthenticationRequired,
    clientInvalidRequest,
    clientServiceUnavailable,
    noStore,
} from "@/utils/client/client-responses";
import {
    getClientRequestSession,
} from "@/utils/client/client-session";


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

    const query =
        parseClientListQuery(
            request.nextUrl
                .searchParams,
        );

    if (!query) {
        return clientInvalidRequest();
    }

    try {
        const result =
            await listClients(
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
            return clientAuthenticationRequired();
        }

        if (
            result.status === 400
        ) {
            return clientInvalidRequest();
        }

        if (
            !result.ok ||
            !result.data
        ) {
            return clientServiceUnavailable();
        }

        return noStore(
            NextResponse.json({
                success: true,
                data: result.data,
            }),
        );
    } catch {
        return clientServiceUnavailable();
    }
}