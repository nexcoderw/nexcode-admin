import "server-only";

export interface PaymentMutationCsrf {
    cookie: string;
    token: string;
}

export interface PaymentEndpointResult<T> {
    ok: boolean;
    status: number;
    data: T | null;
    fields: string[];
}