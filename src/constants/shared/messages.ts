export const MESSAGE_KEYS = {
    auth: {
        invalidRequest:
            "auth.error.invalid_request",

        invalidCredentials:
            "auth.error.invalid_credentials",

        tooManyAttempts:
            "auth.error.too_many_attempts",

        authenticationRequired:
            "auth.error.authentication_required",

        passwordResetVerificationInvalid:
            "auth.error.password_reset_verification_invalid",

        passwordResetSessionInvalid:
            "auth.error.password_reset_session_invalid",

        passwordResetRejected:
            "auth.error.password_reset_rejected",
    },
    team: {
        invalidRequest:
            "team.error.invalid_request",

        notFound:
            "team.error.not_found",
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

    [MESSAGE_KEYS.auth.authenticationRequired]:
        "Your session has expired. Please sign in again.",

    [MESSAGE_KEYS.common.serviceUnavailable]:
        "The service is temporarily unavailable. Please try again.",
    [MESSAGE_KEYS.auth.passwordResetVerificationInvalid]:
        "The verification code is invalid or has expired.",

    [MESSAGE_KEYS.auth.passwordResetSessionInvalid]:
        "Your password reset session has expired. Request a new code and try again.",

    [MESSAGE_KEYS.auth.passwordResetRejected]:
        "The password could not be changed. Check the password requirements and try again.",
    [MESSAGE_KEYS.team.invalidRequest]:
        "Check the team member information and try again.",

    [MESSAGE_KEYS.team.notFound]:
        "The team member could not be found.",
} as const;

export type MessageKey =
    keyof typeof MESSAGES;