import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    deleteClient,
} from "@/endpoints/client/delete-client";
import {
    parseClientId,
} from "@/utils/client/client-id";
import {
    runClientMutation,
} from "@/utils/client/client-mutation";
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


export async function DELETE(
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

    const forwarded =
        new Headers(
            request.headers,
        );

    try {
        const result =
            await runClientMutation(
                session.sessionId,
                session.csrfToken,
                forwarded,

                (csrf) =>
                    deleteClient(
                        clientId,
                        session.sessionId,
                        csrf,
                        forwarded,
                    ),
            );

        if (!result) {
            return clientServiceUnavailable();
        }

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

        if (!result.ok) {
            return clientServiceUnavailable();
        }

        return noStore(
            NextResponse.json({
                success: true,
            }),
        );
    } catch {
        return clientServiceUnavailable();
    }
}