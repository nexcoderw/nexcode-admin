import type {
    ContactReplyInput,
} from "@/types/contact/contact";

/**
 * Narrow an untrusted request body to a reply's subject and message.
 *
 * Returns null unless both are strings. Unknown fields are dropped
 * rather than forwarded. Value rules (both required, a single-line
 * subject) are the backend's to enforce.
 */
export function sanitizeContactReplyPayload(
    value: unknown,
): ContactReplyInput | null {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return null;
    }

    const {
        subject,
        message,
    } = value as Record<string, unknown>;

    if (
        typeof subject !== "string" ||
        typeof message !== "string"
    ) {
        return null;
    }

    return {
        subject,
        message,
    };
}
