import "server-only";

import {
    PAYMENT_NOTIFICATION_STATUSES,
    PAYMENT_REMINDER_CHANNELS,
    PAYMENT_REMINDER_EVENTS,
    PAYMENT_REMINDER_TIMINGS,
} from "@/constants/payment/payment-query";
import {
    asRecord,
    isBoolean,
    isNullableNumber,
    isNullableString,
    isNumber,
    isOneOf,
    isString,
    mapPaymentPagination,
} from "@/endpoints/payment/mapper-utils";
import type {
    PaymentNotification,
    PaymentNotificationListData,
    PaymentReminderRule,
    PaymentReminderRuleListData,
    ReminderAgreement,
} from "@/types/payment/reminder";

export function mapReminderRule(
    value: unknown,
): PaymentReminderRule | null {
    const item = asRecord(
        value,
    );

    const agreement =
        mapReminderAgreement(
            item?.agreement,
        );

    if (
        !item ||
        !agreement ||
        !isNumber(item.id) ||
        !isOneOf(
            item.event,
            PAYMENT_REMINDER_EVENTS,
        ) ||
        !isOneOf(
            item.timing,
            PAYMENT_REMINDER_TIMINGS,
        ) ||
        !isNumber(item.days) ||
        !isOneOf(
            item.channel,
            PAYMENT_REMINDER_CHANNELS,
        ) ||
        !isBoolean(
            item.is_enabled,
        ) ||
        !isNullableNumber(
            item.created_by_id,
        ) ||
        !isString(
            item.created_at,
        ) ||
        !isString(
            item.updated_at,
        )
    ) {
        return null;
    }

    return {
        id: item.id,
        agreement,

        event: item.event,
        timing: item.timing,
        days: item.days,

        channel:
            item.channel,

        isEnabled:
            item.is_enabled,

        createdById:
            item.created_by_id,

        createdAt:
            item.created_at,

        updatedAt:
            item.updated_at,
    };
}

export function mapNotification(
    value: unknown,
): PaymentNotification | null {
    const item = asRecord(
        value,
    );

    const agreement =
        mapReminderAgreement(
            item?.agreement,
        );

    const installment =
        mapNotificationInstallment(
            item?.installment,
        );

    if (
        !item ||
        !agreement ||
        !isNumber(item.id) ||
        !isNullableNumber(
            item.rule_id,
        ) ||
        !isOneOf(
            item.event,
            PAYMENT_REMINDER_EVENTS,
        ) ||
        !isOneOf(
            item.channel,
            PAYMENT_REMINDER_CHANNELS,
        ) ||
        !isString(item.title) ||
        !isString(item.message) ||
        !isString(
            item.target_date,
        ) ||
        !isString(
            item.trigger_date,
        ) ||
        !isOneOf(
            item.status,
            PAYMENT_NOTIFICATION_STATUSES,
        ) ||
        !isNumber(
            item.attempt_count,
        ) ||
        !isNullableString(
            item.last_attempt_at,
        ) ||
        !isNullableString(
            item.sent_at,
        ) ||
        !isNullableString(
            item.read_at,
        ) ||
        !isBoolean(item.is_read) ||
        !isNullableString(
            item.failure_reason,
        ) ||
        !isString(
            item.created_at,
        )
    ) {
        return null;
    }

    if (
        item.installment !== null &&
        !installment
    ) {
        return null;
    }

    return {
        id: item.id,

        ruleId:
            item.rule_id,

        agreement,
        installment,

        event: item.event,
        channel: item.channel,

        title: item.title,
        message: item.message,

        targetDate:
            item.target_date,

        triggerDate:
            item.trigger_date,

        status: item.status,

        attemptCount:
            item.attempt_count,

        lastAttemptAt:
            item.last_attempt_at,

        sentAt:
            item.sent_at,

        readAt:
            item.read_at,

        isRead:
            item.is_read,

        failureReason:
            item.failure_reason,

        createdAt:
            item.created_at,
    };
}

export function mapReminderRuleList(
    value: unknown,
): PaymentReminderRuleListData | null {
    return mapPaginated(
        value,
        mapReminderRule,
    );
}

export function mapNotificationList(
    value: unknown,
): PaymentNotificationListData | null {
    return mapPaginated(
        value,
        mapNotification,
    );
}

function mapPaginated<T>(
    value: unknown,
    mapper: (
        value: unknown,
    ) => T | null,
) {
    const data = asRecord(
        value,
    );

    if (
        !data ||
        !Array.isArray(
            data.items,
        )
    ) {
        return null;
    }

    const items: T[] = [];

    for (
        const raw
        of data.items
    ) {
        const item =
            mapper(raw);

        if (!item) {
            return null;
        }

        items.push(item);
    }

    const pagination =
        mapPaymentPagination(
            data.pagination,
        );

    return pagination
        ? {
            items,
            pagination,
        }
        : null;
}

function mapReminderAgreement(
    value: unknown,
): ReminderAgreement | null {
    const item = asRecord(
        value,
    );

    const portfolio = asRecord(
        item?.portfolio,
    );

    if (
        !item ||
        !portfolio ||
        !isNumber(item.id) ||
        !isString(item.title) ||
        !isNumber(portfolio.id) ||
        !isString(portfolio.name)
    ) {
        return null;
    }

    return {
        id: item.id,
        title: item.title,

        portfolio: {
            id: portfolio.id,
            name: portfolio.name,
        },
    };
}

function mapNotificationInstallment(
    value: unknown,
) {
    if (value === null) {
        return null;
    }

    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isNumber(item.id) ||
        !isString(item.title)
    ) {
        return null;
    }

    return {
        id: item.id,
        title: item.title,
    };
}