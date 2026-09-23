export const CLIENT_MESSAGE_KEYS = {
    invalidRequest:
        "client.error.invalid_request",

    notFound:
        "client.error.not_found",
} as const;

export const CLIENT_MESSAGES = {
    [CLIENT_MESSAGE_KEYS.invalidRequest]:
        "Check the client information and try again.",

    [CLIENT_MESSAGE_KEYS.notFound]:
        "The client could not be found.",
} as const;
