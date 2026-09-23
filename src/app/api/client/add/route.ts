import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    addClient,
} from "@/endpoints/client/add-client";
import {
    sanitizeClientFormData,
} from "@/utils/client/client-form-data";
import {
    runClientMutation,
} from "@/utils/client/client-mutation";
import {
    clientAuthenticationRequired,
    clientInvalidRequest,
    clientServiceUnavailable,
    noStore,
} from "@/utils/client/client-responses";
import {
    getClientRequestSession,
} from "@/utils/client/client-session";


export async function POST(
    request: NextRequest,
) {
    const session =
        getClientRequestSession(
            request,
        );

    if (!session) {
        return clientAuthenticationRequired();
    }

    let formData: FormData;

    try {
        const input =
            await request.formData();

        const sanitized =
            sanitizeClientFormData(
                input,
            );

        if (!sanitized) {
            return clientInvalidRequest();
        }

        formData = sanitized;
    } catch {
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
                    addClient(
                        formData,
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
            NextResponse.json(
                {
                    success: true,

                    data: {
                        client:
                            result.client,
                    },
                },
                {
                    status: 201,
                },
            ),
        );
    } catch {
        return clientServiceUnavailable();
    }
}