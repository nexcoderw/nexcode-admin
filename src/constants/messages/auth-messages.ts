export const AUTH_MESSAGE_KEYS = {
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
} as const;

export const AUTH_MESSAGES = {
    [AUTH_MESSAGE_KEYS.invalidRequest]:
        "Check the information you entered and try again.",

    [AUTH_MESSAGE_KEYS.invalidCredentials]:
        "Invalid email or password.",

    [AUTH_MESSAGE_KEYS.tooManyAttempts]:
        "Too many sign-in attempts. Please try again later.",

    [AUTH_MESSAGE_KEYS.authenticationRequired]:
        "Your session has expired. Please sign in again.",

    [AUTH_MESSAGE_KEYS.passwordResetVerificationInvalid]:
        "The verification code is invalid or has expired.",

    [AUTH_MESSAGE_KEYS.passwordResetSessionInvalid]:
        "Your password reset session has expired. Request a new code and try again.",

    [AUTH_MESSAGE_KEYS.passwordResetRejected]:
        "The password could not be changed. Check the password requirements and try again.",
} as const;
