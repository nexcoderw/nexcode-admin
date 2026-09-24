import {
    PAYMENT_REMINDER_CHANNELS,
    PAYMENT_REMINDER_EVENTS,
    PAYMENT_REMINDER_TIMINGS,
} from "@/constants/payment/payment-query";
import type {
    PaymentReminderRuleInput,
} from "@/types/payment";
import {
    copyBoolean,
    copyChoice,
    copyNumber,
    copyString,
    record,
} from "@/utils/payment/payload-helpers";

export function sanitizeReminderPayload(
    value: unknown,
): PaymentReminderRuleInput | null {
    const raw = record(value);

    if (!raw) {
        return null;
    }

    const output:
        PaymentReminderRuleInput = {};

    if (
        !copyChoice(
            raw,
            output,
            "event",
            PAYMENT_REMINDER_EVENTS,
        ) ||
        !copyChoice(
            raw,
            output,
            "timing",
            PAYMENT_REMINDER_TIMINGS,
        ) ||
        !copyNumber(
            raw,
            output,
            "days",
        ) ||
        !copyString(
            raw,
            output,
            "remindOn",
        ) ||
        !copyChoice(
            raw,
            output,
            "channel",
            PAYMENT_REMINDER_CHANNELS,
        ) ||
        !copyBoolean(
            raw,
            output,
            "isEnabled",
        )
    ) {
        return null;
    }

    return output;
}
