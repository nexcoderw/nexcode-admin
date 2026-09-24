import {
    PAYMENT_NOTIFICATION_STATUSES,
    PAYMENT_REMINDER_CHANNELS,
    PAYMENT_REMINDER_EVENTS,
} from "@/constants/payment/payment-query";
import type {
    PaymentNotificationListQuery,
    PaymentReminderRuleListQuery,
} from "@/types/payment/reminder";
import {
    hasInvalid,
    INVALID,
    readBoolean,
    readChoice,
    readPage,
    readPositiveInt,
} from "@/utils/payment/query";

export function parseReminderRuleQuery(
    params: URLSearchParams,
): PaymentReminderRuleListQuery | null {
    const values = {
        ...sharedFilters(params),
        isEnabled:
            readBoolean(
                params,
                "isEnabled",
            ),
    };

    const page =
        readPage(params);

    if (
        page === INVALID ||
        hasInvalid(
            Object.values(values),
        )
    ) {
        return null;
    }

    return {
        ...(values as PaymentReminderRuleListQuery),
        ...page,
    };
}

export function parseNotificationQuery(
    params: URLSearchParams,
): PaymentNotificationListQuery | null {
    const values = {
        ...sharedFilters(params),
        status:
            readChoice(
                params,
                "status",
                PAYMENT_NOTIFICATION_STATUSES,
            ),
        unread:
            readBoolean(
                params,
                "unread",
            ),
    };

    const page =
        readPage(params);

    if (
        page === INVALID ||
        hasInvalid(
            Object.values(values),
        )
    ) {
        return null;
    }

    return {
        ...(values as PaymentNotificationListQuery),
        ...page,
    };
}

/**
 * The filters reminder rules and notifications have in common.
 */
function sharedFilters(
    params: URLSearchParams,
) {
    return {
        agreementId:
            readPositiveInt(
                params,
                "agreementId",
            ),
        event:
            readChoice(
                params,
                "event",
                PAYMENT_REMINDER_EVENTS,
            ),
        channel:
            readChoice(
                params,
                "channel",
                PAYMENT_REMINDER_CHANNELS,
            ),
    };
}
