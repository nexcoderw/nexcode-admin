import {
    MESSAGE_KEYS,
    MESSAGES,
    type MessageKey,
} from "@/constants/shared/messages";

export function resolveAuthMessage(
    messageKey: unknown,
    fallback: MessageKey =
        MESSAGE_KEYS.common.serviceUnavailable,
) {
    if (
        typeof messageKey === "string" &&
        messageKey in MESSAGES
    ) {
        return MESSAGES[
            messageKey as MessageKey
        ];
    }

    return MESSAGES[fallback];
}