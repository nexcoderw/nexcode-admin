export interface AgreementFinancialSummary {
    totalAmount: string;
    scheduledAmount: string;
    receivedAmount: string;
    allocatedAmount: string;
    unallocatedAmount: string;
    outstandingAmount: string;
    overpaidAmount: string;
    waivedAmount: string;
}

export interface PortfolioFinancialSummary {
    totalContracted: string;
    totalReceived: string;
    outstanding: string;
    overdue: string;
    agreementCount: number;
}