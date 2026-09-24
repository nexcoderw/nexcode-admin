import "server-only";

import type {
    PaymentAgreementInput,
    PaymentAllocationRequest,
    PaymentInstallmentInput,
    PaymentRecordInput,
    PaymentReminderRuleInput,
    PaymentVoidInput,
} from "@/types/payment";
import type {
    ContractScheduleInput,
    MaintenanceScheduleInput,
} from "@/types/payment/schedule";
import type {
    InstallmentWaiverInput,
    MilestoneConfirmationInput,
} from "@/types/payment/installment";

export function toBackendAgreementPayload(
    input: PaymentAgreementInput,
) {
    return mapFields(
        input,
        {
            portfolioId:
                "portfolio_id",
            title:
                "title",
            reference:
                "reference",
            agreementType:
                "agreement_type",
            currency:
                "currency",
            totalAmount:
                "total_amount",
            agreementDate:
                "agreement_date",
            startDate:
                "start_date",
            endDate:
                "end_date",
            status:
                "status",
            notes:
                "notes",
        },
    );
}

export function toBackendInstallmentPayload(
    input: PaymentInstallmentInput,
) {
    return mapFields(
        input,
        {
            sequence:
                "sequence",
            title:
                "title",
            installmentType:
                "installment_type",
            amount:
                "amount",
            dueType:
                "due_type",
            expectedDueDate:
                "expected_due_date",
            dueDate:
                "due_date",
            milestone:
                "milestone",
            gracePeriodDays:
                "grace_period_days",
            notes:
                "notes",
        },
    );
}

export function toBackendRecordPayload(
    input: PaymentRecordInput,
) {
    const payload = mapFields(
        input,
        {
            amount:
                "amount",
            currency:
                "currency",
            paidAt:
                "paid_at",
            paymentMethod:
                "payment_method",
            reference:
                "reference",
            notes:
                "notes",
        },
    );

    if (
        input.allocations !==
        undefined
    ) {
        payload.allocations =
            input.allocations.map(
                (item) => ({
                    installment_id:
                        item.installmentId,
                    amount:
                        item.amount,
                }),
            );
    }

    return payload;
}

export function toBackendAllocationPayload(
    input:
        PaymentAllocationRequest,
) {
    return {
        allocations:
            input.allocations.map(
                (item) => ({
                    installment_id:
                        item.installmentId,
                    amount:
                        item.amount,
                }),
            ),
    };
}

export function toBackendReminderPayload(
    input:
        PaymentReminderRuleInput,
) {
    return mapFields(
        input,
        {
            event: "event",
            timing: "timing",
            days: "days",
            remindOn:
                "remind_on",
            channel: "channel",
            isEnabled:
                "is_enabled",
        },
    );
}

export function toBackendContractSchedulePayload(
    input:
        ContractScheduleInput,
) {
    return mapFields(
        input,
        {
            downPaymentAmount:
                "down_payment_amount",
            downPaymentDate:
                "down_payment_date",
            installmentCount:
                "installment_count",
            firstInstallmentDate:
                "first_installment_date",
            gracePeriodDays:
                "grace_period_days",
        },
    );
}

export function toBackendMaintenanceSchedulePayload(
    input:
        MaintenanceScheduleInput,
) {
    return mapFields(
        input,
        {
            monthlyAmount:
                "monthly_amount",
            months:
                "months",
            firstDueDate:
                "first_due_date",
            gracePeriodDays:
                "grace_period_days",
        },
    );
}

export function toBackendMilestonePayload(
    input:
        MilestoneConfirmationInput,
) {
    return {
        due_date:
            input.dueDate,
    };
}

export function toBackendWaiverPayload(
    input:
        InstallmentWaiverInput,
) {
    return {
        reason:
            input.reason,
    };
}

export function toBackendVoidPayload(
    input: PaymentVoidInput,
) {
    return {
        reason:
            input.reason,
    };
}

function mapFields(
    input: object,
    mapping:
        Record<string, string>,
) {
    const values =
        input as Record<string, unknown>;

    const output:
        Record<string, unknown> = {};

    for (
        const [
            source,
            destination,
        ]
        of Object.entries(
            mapping,
        )
    ) {
        const value =
            values[source];

        if (
            value !== undefined
        ) {
            output[
                destination
            ] = value;
        }
    }

    return output;
}
