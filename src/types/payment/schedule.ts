export interface ContractScheduleInput {
    downPaymentAmount?: string;
    downPaymentDate?: string;

    installmentCount?: number;
    firstInstallmentDate?: string;

    gracePeriodDays?: number;
}

export interface MaintenanceScheduleInput {
    monthlyAmount?: string;
    months?: number;
    firstDueDate?: string;
    gracePeriodDays?: number;
}