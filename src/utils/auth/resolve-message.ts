import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import { MESSAGES, type MessageKey } from "@/constants/messages/messages";

export function resolveAuthMessage(
    messageKey: unknown,
    fallback: MessageKey =
        COMMON_MESSAGE_KEYS.serviceUnavailable,
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