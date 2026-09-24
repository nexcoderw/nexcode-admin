import {
    PAYMENT_CURRENCIES,
    PAYMENT_METHODS,
} from "@/constants/payment/payment-query";
import type {
    PaymentAllocationRequest,
    PaymentRecordInput,
} from "@/types/payment";
import {
    copyChoice,
    copyString,
    record,
} from "@/utils/payment/payload-helpers";

export function sanitizeRecordPayload(
    value: unknown,
): PaymentRecordInput | null {
    const raw = record(value);

    if (!raw) {
        return null;
    }

    const output:
        PaymentRecordInput = {};

    if (
        !copyString(
            raw,
            output,
            "amount",
        ) ||
        !copyChoice(
            raw,
            output,
            "currency",
            PAYMENT_CURRENCIES,
        ) ||
        !copyString(
            raw,
            output,
            "paidAt",
        ) ||
        !copyChoice(
            raw,
            output,
            "paymentMethod",
            PAYMENT_METHODS,
        ) ||
        !copyString(
            raw,
            output,
            "reference",
        ) ||
        !copyString(
            raw,
            output,
            "notes",
        )
    ) {
        return null;
    }

    if (
        "allocations"
        in raw
    ) {
        const allocations =
            sanitizeAllocations(
                raw.allocations,
            );

        if (!allocations) {
            return null;
        }

        output.allocations =
            allocations;
    }

    return output;
}

export function sanitizeAllocationPayload(
    value: unknown,
): PaymentAllocationRequest | null {
    const raw = record(value);

    if (
        !raw ||
        !(
            "allocations"
            in raw
        )
    ) {
        return null;
    }

    const allocations =
        sanitizeAllocations(
            raw.allocations,
        );

    return allocations
        ? {
            allocations,
        }
        : null;
}

function sanitizeAllocations(
    value: unknown,
) {
    if (!Array.isArray(value)) {
        return null;
    }

    const allocations = [];

    for (const raw of value) {
        const item = record(raw);

        if (
            !item ||
            typeof item.installmentId
            !== "number" ||
            !Number.isInteger(
                item.installmentId,
            ) ||
            item.installmentId < 1 ||
            typeof item.amount
            !== "string"
        ) {
            return null;
        }

        allocations.push({
            installmentId:
                item.installmentId,
            amount:
                item.amount,
        });
    }

    return allocations;
}
