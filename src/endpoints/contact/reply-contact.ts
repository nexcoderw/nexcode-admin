import "server-only";

import {
    backendRequest,
} from "@/endpoints/client";
import {
    mapContact,
} from "@/endpoints/contact/mapper";
import {
    contactRequestHeaders,
} from "@/endpoints/contact/request-headers";
import type {
    ContactMutationCsrf,
    ContactReplyResult,
} from "@/endpoints/contact/types";
import type {
    ContactReplyInput,
} from "@/types/contact/contact";


interface BackendResponse {
    data?: {
        contact?: unknown;
    };

    errors?: unknown;
}

const REPLY_FIELDS = [
    "subject",
    "message",
] as const;


export async function replyToContact(
    contactId: number,
    input: ContactReplyInput,
    sessionId: string,
    csrf: ContactMutationCsrf,
    forwarded: Headers,
): Promise<ContactReplyResult> {
    const result =
        await backendRequest<BackendResponse>(
            `/api/admin/contact/reply/${contactId}/`,
            {
                method: "POST",
                forwarded,

                headers:
                    contactRequestHeaders(
                        sessionId,
                        csrf,
                    ),

                body: {
                    subject:
                        input.subject,
                    message:
                        input.message,
                },
            },
        );

    if (!result.ok) {
        return {
            ok: false,
            status: result.status,
            contact: null,

            fields:
                getErrorFields(
                    result.data?.errors,
                ),
        };
    }

    const contact =
        mapContact(
            result.data?.data
                ?.contact,
        );

    return {
        ok: Boolean(contact),

        status: contact
            ? result.status
            : 502,

        contact,
        fields: [],
    };
}


/**
 * The reply fields the backend rejected. Both names match the admin's,
 * so they pass through as they are; anything else is dropped.
 */
function getErrorFields(
    errors: unknown,
) {
    if (
        !errors ||
        typeof errors !== "object" ||
        Array.isArray(errors)
    ) {
        return [];
    }

    return Object.keys(errors).filter(
        (field) =>
            (
                REPLY_FIELDS as
                readonly string[]
            ).includes(field),
    );
}
