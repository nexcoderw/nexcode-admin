export const MESSAGE_KEYS = {
    auth: {
        invalidRequest:
            "auth.error.invalid_request",
        invalidCredentials:
            "auth.error.invalid_credentials",
        tooManyAttempts:
            "auth.error.too_many_attempts",
    },

    common: {
        serviceUnavailable:
            "common.error.service_unavailable",
    },
} as const;

export const MESSAGES = {
    [MESSAGE_KEYS.auth.invalidRequest]:
        "Check the information you entered and try again.",

    [MESSAGE_KEYS.auth.invalidCredentials]:
        "Invalid email or password.",

    [MESSAGE_KEYS.auth.tooManyAttempts]:
        "Too many sign-in attempts. Please try again later.",

    [MESSAGE_KEYS.common.serviceUnavailable]:
        "The service is temporarily unavailable. Please try again.",
} as const;

export type MessageKey =
    keyof typeof MESSAGES;