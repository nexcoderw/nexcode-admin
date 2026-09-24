import type {
    PaymentListData,
} from "@/types/payment/shared";

export type PaymentReminderEvent =
    | "installment_due"
    | "milestone_expected"
    | "agreement_expiry";

export type PaymentReminderTiming =
    | "before"
    | "on"
    | "after"
    | "date";

export type PaymentReminderChannel =
    | "in_app"
    | "email";

export type PaymentNotificationStatus =
    | "pending"
    | "sent"
    | "failed";

export interface ReminderAgreement {
    id: number;
    title: string;

    portfolio: {
        id: number;
        name: string;
    };
}

export interface PaymentReminderRule {
    id: number;

    agreement:
        ReminderAgreement;

    event:
        PaymentReminderEvent;

    timing:
        PaymentReminderTiming;

    days: number;

    /**
     * The day a "date"-timed rule fires (YYYY-MM-DD); null otherwise.
     */
    remindOn:
        string | null;

    channel:
        PaymentReminderChannel;

    isEnabled: boolean;

    createdById:
        number | null;

    createdAt: string;
    updatedAt: string;
}

export interface PaymentReminderRuleInput {
    event?:
        PaymentReminderEvent;

    timing?:
        PaymentReminderTiming;

    days?: number;

    remindOn?: string;

    channel?:
        PaymentReminderChannel;

    isEnabled?: boolean;
}

export interface PaymentReminderRuleListQuery {
    agreementId?: number;

    event?:
        PaymentReminderEvent;

    channel?:
        PaymentReminderChannel;

    isEnabled?: boolean;

    page?: number;
    pageSize?: number;
}

export interface PaymentNotification {
    id: number;
    ruleId: number | null;

    agreement:
        ReminderAgreement;

    installment: {
        id: number;
        title: string;
    } | null;

    event:
        PaymentReminderEvent;

    channel:
        PaymentReminderChannel;

    title: string;
    message: string;

    targetDate: string;
    triggerDate: string;

    status:
        PaymentNotificationStatus;

    attemptCount: number;

    lastAttemptAt:
        string | null;

    sentAt:
        string | null;

    readAt:
        string | null;

    isRead: boolean;

    failureReason:
        string | null;

    createdAt: string;
}

export interface PaymentNotificationListQuery {
    agreementId?: number;

    event?:
        PaymentReminderEvent;

    channel?:
        PaymentReminderChannel;

    status?:
        PaymentNotificationStatus;

    unread?: boolean;

    page?: number;
    pageSize?: number;
}

export type PaymentReminderRuleListData =
    PaymentListData<PaymentReminderRule>;

export type PaymentNotificationListData =
    PaymentListData<PaymentNotification>;