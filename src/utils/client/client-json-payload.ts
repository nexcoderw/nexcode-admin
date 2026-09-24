import type {
    ClientInput,
} from "@/types/client/client";

const CLIENT_INPUT_FIELDS = [
    "name",
    "email",
    "phoneNumber",
] as const;

/**
 * Narrow an untrusted request body to the client's editable fields.
 *
 * Returns null when the body is not an object or a known field is not a
 * string. Unknown fields are dropped rather than forwarded. Value rules
 * (a required name, a valid email) are the backend's to enforce.
 */
export function sanitizeClientPayload(
    value: unknown,
): ClientInput | null {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return null;
    }

    const input =
        value as Record<string, unknown>;

    const output: ClientInput = {};

    for (const field of CLIENT_INPUT_FIELDS) {
        if (!(field in input)) {
            continue;
        }

        const fieldValue =
            input[field];

        if (typeof fieldValue !== "string") {
            return null;
        }

        output[field] = fieldValue;
    }

    return output;
}
