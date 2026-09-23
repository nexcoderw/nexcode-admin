export const PORTFOLIO_MESSAGE_KEYS = {
    invalidRequest:
        "portfolio.error.invalid_request",

    notFound:
        "portfolio.error.not_found",

    imageNotFound:
        "portfolio.image.error.not_found",

    documentNotFound:
        "portfolio.document.error.not_found",

    repositoryNotFound:
        "portfolio.repository.error.not_found",
} as const;

export const PORTFOLIO_MESSAGES = {
    [PORTFOLIO_MESSAGE_KEYS.invalidRequest]:
        "Check the portfolio information and try again.",

    [PORTFOLIO_MESSAGE_KEYS.notFound]:
        "The portfolio could not be found.",

    [PORTFOLIO_MESSAGE_KEYS.imageNotFound]:
        "The portfolio image could not be found.",

    [PORTFOLIO_MESSAGE_KEYS.documentNotFound]:
        "The portfolio document link could not be found.",

    [PORTFOLIO_MESSAGE_KEYS.repositoryNotFound]:
        "The portfolio repository could not be found.",
} as const;
