import { describe, expect, it } from "vitest";

import { toBackendReminderPayload } from "@/endpoints/payment/payload";
import { mapReminderRule } from "@/endpoints/payment/reminder-mapper";
import {
    describeReminderRule,
    formatPaymentDate,
} from "@/utils/payment/payment-format";
import { sanitizeReminderPayload } from "@/utils/payment/reminder-payloads";

function backendRule(overrides: Record<string, unknown> = {}) {
    return {
        id: 5,
        agreement: {
            id: 1,
            title: "Maintenance Contract",
            portfolio: { id: 4, name: "Talent Match Platform" },
        },
        event: "installment_due",
        timing: "date",
        days: 0,
        remind_on: "2026-09-28",
        channel: "email",
        is_enabled: true,
        created_by_id: 2,
        created_at: "2026-09-25T08:00:00+00:00",
        updated_at: "2026-09-25T08:00:00+00:00",
        ...overrides,
    };
}

describe("set-date payment reminders", () => {
    it("maps the chosen date from the backend", () => {
        const rule = mapReminderRule(backendRule());

        expect(rule?.timing).toBe("date");
        expect(rule?.remindOn).toBe("2026-09-28");
    });

    it("maps relative rules with no date", () => {
        const rule = mapReminderRule(
            backendRule({ timing: "before", days: 3, remind_on: null }),
        );

        expect(rule?.remindOn).toBeNull();
    });

    it("rejects a malformed date or timing", () => {
        expect(mapReminderRule(backendRule({ remind_on: 20260928 }))).toBeNull();
        expect(mapReminderRule(backendRule({ remind_on: undefined }))).toBeNull();
        expect(mapReminderRule(backendRule({ timing: "weekly" }))).toBeNull();
    });

    it("describes a dated rule by its date", () => {
        const rule = mapReminderRule(backendRule());

        // Month abbreviations vary by ICU version ("Sep" or "Sept").
        expect(describeReminderRule(rule!)).toBe(
            `On ${formatPaymentDate("2026-09-28")}: Installment due`,
        );
    });

    it("accepts a chosen date from the browser and sends it as remind_on", () => {
        const input = sanitizeReminderPayload({
            event: "installment_due",
            timing: "date",
            days: 0,
            remindOn: "2026-09-28",
            channel: "email",
            isEnabled: true,
            remind_on: "1999-01-01",
        });

        expect(input).toEqual({
            event: "installment_due",
            timing: "date",
            days: 0,
            remindOn: "2026-09-28",
            channel: "email",
            isEnabled: true,
        });

        expect(toBackendReminderPayload(input!)).toEqual({
            event: "installment_due",
            timing: "date",
            days: 0,
            remind_on: "2026-09-28",
            channel: "email",
            is_enabled: true,
        });
    });

    it("rejects a date that is not a string", () => {
        expect(
            sanitizeReminderPayload({ timing: "date", remindOn: 20260928 }),
        ).toBeNull();
    });
});
