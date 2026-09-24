export type PaymentInstallmentType =
    | "down_payment"
    | "installment"
    | "final_payment"
    | "milestone"
    | "maintenance"
    | "custom";

export type PaymentDueType =
    | "fixed_date"
    | "milestone";

export type InstallmentPaymentState =
    | "unpaid"
    | "partial"
    | "paid"
    | "waived";

export type InstallmentTimingState =
    | "upcoming"
    | "due_today"
    | "grace_period"
    | "overdue"
    | "awaiting_milestone"
    | "settled";

export interface InstallmentFinancialState {
    expectedAmount: string;
    paidAmount: string;
    outstandingAmount: string;

    paymentState:
        InstallmentPaymentState;

    timingState:
        InstallmentTimingState;

    effectiveDueDate:
        string | null;
}

export interface PaymentInstallment {
    id: number;
    agreementId: number;
    sequence: number;

    title: string;

    installmentType:
        PaymentInstallmentType;

    amount: string;

    dueType:
        PaymentDueType;

    expectedDueDate: string;
    dueDate: string | null;
    milestone: string | null;

    gracePeriodDays: number;

    isWaived: boolean;
    waivedAt: string | null;
    waiverReason: string | null;

    notes: string;

    financial:
        InstallmentFinancialState;

    createdAt: string;
    updatedAt: string;
}

export interface PaymentInstallmentInput {
    sequence?: number;
    title?: string;

    installmentType?:
        PaymentInstallmentType;

    amount?: string;

    dueType?:
        PaymentDueType;

    expectedDueDate?: string;
    dueDate?: string;
    milestone?: string;

    gracePeriodDays?: number;
    notes?: string;
}

export interface MilestoneConfirmationInput {
    dueDate: string;
}

export interface InstallmentWaiverInput {
    reason: string;
}