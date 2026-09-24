export const CONTACT_MESSAGE_KEYS = {
    invalidRequest:
        "contact.error.invalid_request",

    notFound:
        "contact.error.not_found",

    emailNotSent:
        "contact.error.email_not_sent",
} as const;

export const CONTACT_MESSAGES = {
    [CONTACT_MESSAGE_KEYS.invalidRequest]:
        "Check the reply and try again.",

    [CONTACT_MESSAGE_KEYS.notFound]:
        "The message could not be found.",

    [CONTACT_MESSAGE_KEYS.emailNotSent]:
        "The email could not be sent. Please try again shortly.",
} as const;
