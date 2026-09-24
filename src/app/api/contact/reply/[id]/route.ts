import {
    type NextRequest,
    NextResponse,
} from "next/server";

import {
    replyToContact,
} from "@/endpoints/contact/reply-contact";
import {
    parseContactId,
} from "@/utils/contact/contact-id";
import {
    runContactMutation,
} from "@/utils/contact/contact-mutation";
import {
    sanitizeContactReplyPayload,
} from "@/utils/contact/contact-reply-payload";
import {
    contactAuthenticationRequired,
    contactEmailNotSent,
    contactInvalidRequest,
    contactNotFound,
    contactServiceUnavailable,
    noStore,
} from "@/utils/contact/contact-responses";
import {
    getContactRequestSession,
} from "@/utils/contact/contact-session";


interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}


export async function POST(
    request: NextRequest,
    context: RouteContext,
) {
    const session =
        getContactRequestSession(
            request,
        );

    if (!session) {
        return contactAuthenticationRequired();
    }

    const contactId =
        parseContactId(
            (await context.params).id,
        );

    if (!contactId) {
        return contactInvalidRequest();
    }

    let raw: unknown;

    try {
        raw =
            await request.json();
    } catch {
        return contactInvalidRequest();
    }

    const input =
        sanitizeContactReplyPayload(
            raw,
        );

    if (!input) {
        return contactInvalidRequest();
    }

    const forwarded =
        new Headers(
            request.headers,
        );

    try {
        const result =
            await runContactMutation(
                session.sessionId,
                session.csrfToken,
                forwarded,

                (csrf) =>
                    replyToContact(
                        contactId,
                        input,
                        session.sessionId,
                        csrf,
                        forwarded,
                    ),
            );

        if (!result) {
            return contactServiceUnavailable();
        }

        if (
            result.status === 401 ||
            result.status === 403
        ) {
            return contactAuthenticationRequired();
        }

        if (result.status === 404) {
            return contactNotFound();
        }

        if (result.status === 400) {
            return contactInvalidRequest(
                result.fields,
            );
        }

        // The backend could not hand the email to the mail server.
        if (result.status === 502) {
            return contactEmailNotSent();
        }

        if (
            !result.ok ||
            !result.contact
        ) {
            return contactServiceUnavailable();
        }

        return noStore(
            NextResponse.json(
                {
                    success: true,

                    data: {
                        contact:
                            result.contact,
                    },
                },
                {
                    status: 201,
                },
            ),
        );
    } catch {
        return contactServiceUnavailable();
    }
}
