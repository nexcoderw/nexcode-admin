export const TEAM_MESSAGE_KEYS = {
    invalidRequest:
        "team.error.invalid_request",

    notFound:
        "team.error.not_found",
} as const;

export const TEAM_MESSAGES = {
    [TEAM_MESSAGE_KEYS.invalidRequest]:
        "Check the team member information and try again.",

    [TEAM_MESSAGE_KEYS.notFound]:
        "The team member could not be found.",
} as const;
