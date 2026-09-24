import "server-only";

import type {
    ClientInput,
} from "@/types/client/client";

/**
 * Translate the admin's field names into the backend's. Undefined
 * fields are left out entirely, so an update only changes what was
 * actually sent.
 */
export function toBackendClientPayload(
    input: ClientInput,
) {
    const payload:
        Record<string, string> = {};

    if (input.name !== undefined) {
        payload.name = input.name;
    }

    if (input.email !== undefined) {
        payload.email = input.email;
    }

    if (
        input.phoneNumber !==
        undefined
    ) {
        payload.phone_number =
            input.phoneNumber;
    }

    return payload;
}
