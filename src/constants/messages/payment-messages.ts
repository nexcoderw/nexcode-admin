export const PAYMENT_MESSAGE_KEYS = {
    invalidRequest:
        "payment.error.invalid_request",

    agreementNotFound:
        "payment.error.agreement_not_found",

    installmentNotFound:
        "payment.error.installment_not_found",

    recordNotFound:
        "payment.error.record_not_found",

    reminderRuleNotFound:
        "payment.error.reminder_rule_not_found",

    notificationNotFound:
        "payment.error.notification_not_found",

    portfolioNotFound:
        "payment.error.portfolio_not_found",
} as const;

export const PAYMENT_MESSAGES = {
    [PAYMENT_MESSAGE_KEYS.invalidRequest]:
        "Check the payment information and try again.",

    [PAYMENT_MESSAGE_KEYS.agreementNotFound]:
        "The payment agreement could not be found.",

    [PAYMENT_MESSAGE_KEYS.installmentNotFound]:
        "The payment installment could not be found.",

    [PAYMENT_MESSAGE_KEYS.recordNotFound]:
        "The payment record could not be found.",

    [PAYMENT_MESSAGE_KEYS.reminderRuleNotFound]:
        "The payment reminder rule could not be found.",

    [PAYMENT_MESSAGE_KEYS.notificationNotFound]:
        "The payment notification could not be found.",

    [PAYMENT_MESSAGE_KEYS.portfolioNotFound]:
        "The Portfolio payment record could not be found.",
} as const;
