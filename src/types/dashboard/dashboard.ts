import type { PaymentCurrency } from "@/types/payment/shared";

export interface DashboardMoney {
  collectedThisMonth: string;
  collectedLastMonth: string;
  collectedThisYear: string;
  outstanding: string;
  overdue: string;
  overdueCount: number;
  expectedNext30Days: string;
}

export interface DashboardCounts {
  activeAgreements: number;
  agreements: number;
  unansweredMessages: number;
  messagesThisMonth: number;
  clients: number;
  publishedPortfolios: number;
  portfolios: number;
  teamMembers: number;
}

export interface CashflowMonth {
  /** YYYY-MM */
  month: string;
  expected: string;
  /** Null for months that have not happened yet. */
  collected: string | null;
}

export interface MessageWeek {
  /** The Monday the week starts on, YYYY-MM-DD. */
  week: string;
  count: number;
}

export interface CountSlice {
  key: string;
  label: string;
  count: number;
}

export interface InstallmentAlert {
  installmentId: number;
  agreementId: number;
  agreementTitle: string;
  portfolioName: string;
  title: string;
  dueDate: string;
  /** Days until due, or days overdue in the overdue list. */
  days: number;
  outstanding: string;
  currency: PaymentCurrency;
  inGrace: boolean;
}

export interface EndingAlert {
  agreementId: number;
  agreementTitle: string;
  portfolioName: string;
  endDate: string;
  days: number;
}

export interface RecentPayment {
  id: number;
  agreementId: number;
  agreementTitle: string;
  portfolioName: string;
  amount: string;
  paidAt: string;
  paymentMethod: string;
}

export interface DashboardOverview {
  currency: PaymentCurrency;
  currencies: PaymentCurrency[];
  today: string;
  money: DashboardMoney;
  counts: DashboardCounts;
  cashflow: CashflowMonth[];
  messagesByWeek: MessageWeek[];
  agreementsByStatus: CountSlice[];
  portfoliosByCategory: CountSlice[];
  alerts: {
    dueSoon: InstallmentAlert[];
    overdue: InstallmentAlert[];
    endingSoon: EndingAlert[];
  };
  recentPayments: RecentPayment[];
}
