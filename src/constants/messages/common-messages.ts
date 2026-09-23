export const COMMON_MESSAGE_KEYS = {
    serviceUnavailable:
        "common.error.service_unavailable",
} as const;

export const COMMON_MESSAGES = {
    [COMMON_MESSAGE_KEYS.serviceUnavailable]:
        "The service is temporarily unavailable. Please try again.",
} as const;
