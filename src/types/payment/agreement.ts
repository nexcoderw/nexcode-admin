import type {
    PaymentCurrency,
    PaymentListData,
} from "@/types/payment/shared";

export type PaymentAgreementType =
    | "project"
    | "maintenance"
    | "custom";

export type PaymentAgreementStatus =
    | "draft"
    | "active"
    | "completed"
    | "cancelled";

export type PaymentAgreementOrdering =
    | "title"
    | "-title"
    | "total_amount"
    | "-total_amount"
    | "agreement_date"
    | "-agreement_date"
    | "start_date"
    | "-start_date"
    | "created_at"
    | "-created_at"
    | "updated_at"
    | "-updated_at";

export interface PaymentAgreementPortfolio {
    id: number;
    name: string;
    slug: string;
}

export interface PaymentAgreement {
    id: number;
    portfolio:
        PaymentAgreementPortfolio;

    title: string;
    reference: string | null;

    agreementType:
        PaymentAgreementType;

    currency: PaymentCurrency;
    totalAmount: string;

    agreementDate: string;
    startDate: string;
    endDate: string | null;

    status:
        PaymentAgreementStatus;

    notes: string;

    createdAt: string;
    updatedAt: string;
}

export interface PaymentAgreementInput {
    portfolioId?: number;
    title?: string;
    reference?: string;

    agreementType?:
        PaymentAgreementType;

    currency?: PaymentCurrency;
    totalAmount?: string;

    agreementDate?: string;
    startDate?: string;
    endDate?: string;

    status?:
        PaymentAgreementStatus;

    notes?: string;
}

export interface PaymentAgreementListQuery {
    search?: string;

    ordering?:
        PaymentAgreementOrdering;

    portfolioId?: number;

    agreementType?:
        PaymentAgreementType;

    status?:
        PaymentAgreementStatus;

    currency?: PaymentCurrency;

    page?: number;
    pageSize?: number;
}

export type PaymentAgreementListData =
    PaymentListData<PaymentAgreement>;