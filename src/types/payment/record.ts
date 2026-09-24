import type {
    PaymentCurrency,
    PaymentListData,
} from "@/types/payment/shared";

export type PaymentMethod =
    | "bank_transfer"
    | "mobile_money"
    | "cash"
    | "card"
    | "cheque"
    | "other";

export type PaymentRecordStatus =
    | "posted"
    | "voided";

export type PaymentRecordOrdering =
    | "amount"
    | "-amount"
    | "paid_at"
    | "-paid_at"
    | "created_at"
    | "-created_at";

export interface PaymentAllocation {
    id: number;
    installmentId: number;
    installmentTitle: string;
    amount: string;
}

export interface PaymentRecordedBy {
    id: number;
    name: string;
}

export interface PaymentRecord {
    id: number;
    agreementId: number;

    amount: string;
    currency: PaymentCurrency;

    paidAt: string;

    paymentMethod:
        PaymentMethod;

    reference: string | null;
    notes: string;

    status:
        PaymentRecordStatus;

    voidedAt: string | null;
    voidReason: string | null;

    recordedBy:
        PaymentRecordedBy | null;

    allocations:
        PaymentAllocation[];

    createdAt: string;
    updatedAt: string;
}

export interface PaymentAllocationInput {
    installmentId: number;
    amount: string;
}

export interface PaymentRecordInput {
    amount?: string;

    currency?:
        PaymentCurrency;

    paidAt?: string;

    paymentMethod?:
        PaymentMethod;

    reference?: string;
    notes?: string;

    allocations?:
        PaymentAllocationInput[];
}

export interface PaymentAllocationRequest {
    allocations:
        PaymentAllocationInput[];
}

export interface PaymentVoidInput {
    reason: string;
}

export interface PaymentRecordListQuery {
    ordering?:
        PaymentRecordOrdering;

    agreementId?: number;
    portfolioId?: number;

    status?:
        PaymentRecordStatus;

    paymentMethod?:
        PaymentMethod;

    paidFrom?: string;
    paidTo?: string;

    page?: number;
    pageSize?: number;
}

export type PaymentRecordListData =
    PaymentListData<PaymentRecord>;