import type {
    ContractScheduleInput,
    MaintenanceScheduleInput,
} from "@/types/payment";
import {
    record,
} from "@/utils/payment/payload-helpers";

export function sanitizeContractSchedulePayload(
    value: unknown,
): ContractScheduleInput | null {
    return sanitizeSchedule(
        value,
        false,
    );
}

export function sanitizeMaintenanceSchedulePayload(
    value: unknown,
): MaintenanceScheduleInput | null {
    return sanitizeSchedule(
        value,
        true,
    );
}

function sanitizeSchedule(
    value: unknown,
    maintenance: boolean,
) {
    const raw = record(value);

    if (!raw) {
        return null;
    }

    const output:
        Record<string, unknown> = {};

    const fields =
        maintenance
            ? [
                [
                    "monthlyAmount",
                    "string",
                ],
                [
                    "months",
                    "number",
                ],
                [
                    "firstDueDate",
                    "string",
                ],
                [
                    "gracePeriodDays",
                    "number",
                ],
            ]
            : [
                [
                    "downPaymentAmount",
                    "string",
                ],
                [
                    "downPaymentDate",
                    "string",
                ],
                [
                    "installmentCount",
                    "number",
                ],
                [
                    "firstInstallmentDate",
                    "string",
                ],
                [
                    "gracePeriodDays",
                    "number",
                ],
            ];

    for (const [key, type] of fields) {
        if (!(key in raw)) {
            continue;
        }

        if (
            typeof raw[key]
            !== type
        ) {
            return null;
        }

        output[key] = raw[key];
    }

    return output;
}
