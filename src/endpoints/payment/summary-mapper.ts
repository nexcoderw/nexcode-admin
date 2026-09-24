import "server-only";

import {
    asRecord,
    isNumber,
    isString,
} from "@/endpoints/payment/mapper-utils";
import type {
    AgreementFinancialSummary,
    PortfolioFinancialSummary,
} from "@/types/payment/summary";

export function mapAgreementSummary(
    value: unknown,
): AgreementFinancialSummary | null {
    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isString(
            item.total_amount,
        ) ||
        !isString(
            item.scheduled_amount,
        ) ||
        !isString(
            item.received_amount,
        ) ||
        !isString(
            item.allocated_amount,
        ) ||
        !isString(
            item.unallocated_amount,
        ) ||
        !isString(
            item.outstanding_amount,
        ) ||
        !isString(
            item.overpaid_amount,
        ) ||
        !isString(
            item.waived_amount,
        )
    ) {
        return null;
    }

    return {
        totalAmount:
            item.total_amount,

        scheduledAmount:
            item.scheduled_amount,

        receivedAmount:
            item.received_amount,

        allocatedAmount:
            item.allocated_amount,

        unallocatedAmount:
            item.unallocated_amount,

        outstandingAmount:
            item.outstanding_amount,

        overpaidAmount:
            item.overpaid_amount,

        waivedAmount:
            item.waived_amount,
    };
}

export function mapPortfolioSummary(
    value: unknown,
): PortfolioFinancialSummary | null {
    const item = asRecord(
        value,
    );

    if (
        !item ||
        !isString(
            item.total_contracted,
        ) ||
        !isString(
            item.total_received,
        ) ||
        !isString(
            item.outstanding,
        ) ||
        !isString(
            item.overdue,
        ) ||
        !isNumber(
            item.agreement_count,
        )
    ) {
        return null;
    }

    return {
        totalContracted:
            item.total_contracted,

        totalReceived:
            item.total_received,

        outstanding:
            item.outstanding,

        overdue:
            item.overdue,

        agreementCount:
            item.agreement_count,
    };
}
