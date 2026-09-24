export type PaymentCurrency =
    | "RWF"
    | "USD"
    | "EUR"
    | "GBP";

export interface PaymentPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaymentListData<T> {
    items: T[];
    pagination: PaymentPagination;
}