import type {
  InstallmentPaymentState,
  InstallmentTimingState,
} from "@/types/payment/installment";
import type {
  PaymentMethod,
  PaymentRecordStatus,
} from "@/types/payment/record";
import type {
  PaymentCurrency,
} from "@/types/payment/shared";

export type PaymentOutstandingKind =
  | "all"
  | "overdue"
  | "due_soon";

export interface PaymentReportQuery {
  portfolioId?: number;
  currency?: PaymentCurrency;

  dateFrom?: string;
  dateTo?: string;

  dueWithinDays?: number;

  outstandingKind?:
    PaymentOutstandingKind;
}

export interface PaymentReportCurrency {
  currency:
    PaymentCurrency;

  totalContracted: string;
  totalReceived: string;

  outstanding: string;
  overdue: string;
  dueSoon: string;

  agreementCount: number;
  activeAgreementCount: number;
}

export interface PaymentReportOverview {
  asOf: string;
  dueWithinDays: number;

  currencies:
    PaymentReportCurrency[];
}

export interface PaymentCollectionRow {
  month: string;
  currency:
    PaymentCurrency;

  amount: string;
  paymentCount: number;
}

export interface PaymentCollectionsReport {
  dateFrom:
    string | null;

  dateTo:
    string | null;

  rows:
    PaymentCollectionRow[];
}

export interface PaymentOutstandingRow {
  installmentId: number;
  agreementId: number;

  agreementTitle: string;

  portfolio: {
    id: number;
    name: string;
  };

  title: string;

  currency:
    PaymentCurrency;

  amount: string;
  paidAmount: string;
  outstandingAmount: string;

  dueDate:
    string | null;

  expectedDueDate: string;

  effectiveDueDate:
    string | null;

  paymentState:
    InstallmentPaymentState;

  timingState:
    InstallmentTimingState;

  daysFromDue:
    number | null;
}

export interface PaymentOutstandingReport {
  asOf: string;
  dueWithinDays: number;

  kind:
    PaymentOutstandingKind;

  rows:
    PaymentOutstandingRow[];
}

export interface StatementCurrencySummary {
  currency:
    PaymentCurrency;

  totalContracted: string;
  totalReceived: string;
  outstanding: string;
}

export interface StatementAgreement {
  id: number;
  title: string;

  reference:
    string | null;

  status: string;

  currency:
    PaymentCurrency;

  totalAmount: string;
  receivedAmount: string;
  outstandingAmount: string;

  startDate: string;

  endDate:
    string | null;
}

export interface StatementPayment {
  id: number;

  receiptNumber: string;

  agreementId: number;
  agreementTitle: string;

  currency:
    PaymentCurrency;

  amount: string;
  paidAt: string;

  status:
    PaymentRecordStatus;

  paymentMethod:
    PaymentMethod;

  reference:
    string | null;
}

export interface PaymentPortfolioStatement {
  generatedAt: string;

  portfolio: {
    id: number;
    name: string;
    slug: string;
  };

  currencies:
    StatementCurrencySummary[];

  agreements:
    StatementAgreement[];

  payments:
    StatementPayment[];
}

export interface PaymentReceipt {
  receiptNumber: string;
  issuedAt: string;

  portfolio: {
    id: number;
    name: string;
  };

  agreement: {
    id: number;
    title: string;

    reference:
      string | null;
  };

  payment: {
    id: number;

    amount: string;

    currency:
      PaymentCurrency;

    paidAt: string;

    paymentMethod:
      PaymentMethod;

    reference:
      string | null;

    status:
      PaymentRecordStatus;

    voidedAt:
      string | null;

    voidReason:
      string | null;

    recordedBy:
      string | null;
  };

  allocations: Array<{
    installmentId: number;
    installmentTitle: string;
    amount: string;
  }>;
}