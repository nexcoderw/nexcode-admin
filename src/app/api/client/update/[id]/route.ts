import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    editClient,
} from "@/endpoints/client/edit-client";
import {
    parseClientId,
} from "@/utils/client/client-id";
import {
    sanitizeClientPayload,
} from "@/utils/client/client-json-payload";
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


export async function PATCH(
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

    let raw: unknown;

    try {
        raw =
            await request.json();
    } catch {
        return clientInvalidRequest();
    }

    const input =
        sanitizeClientPayload(
            raw,
        );

    if (!input) {
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
                    editClient(
                        clientId,
                        input,
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

        if (
            result.status === 400
        ) {
            return clientInvalidRequest(
                result.fields,
            );
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