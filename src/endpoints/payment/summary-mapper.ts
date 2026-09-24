import "server-only";

import {
    asRecord,
    isMoney,
    isNumber,
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
        !isMoney(
            item.total_amount,
        ) ||
        !isMoney(
            item.scheduled_amount,
        ) ||
        !isMoney(
            item.received_amount,
        ) ||
        !isMoney(
            item.allocated_amount,
        ) ||
        !isMoney(
            item.unallocated_amount,
        ) ||
        !isMoney(
            item.outstanding_amount,
        ) ||
        !isMoney(
            item.overpaid_amount,
        ) ||
        !isMoney(
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
        !isMoney(
            item.total_contracted,
        ) ||
        !isMoney(
            item.total_received,
        ) ||
        !isMoney(
            item.outstanding,
        ) ||
        !isMoney(
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
