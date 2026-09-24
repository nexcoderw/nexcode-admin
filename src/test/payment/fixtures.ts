/*
 * Payment records shaped exactly as the Django admin API sends them:
 * snake_case keys, and money as decimal strings with two places.
 */

export const AGREEMENT_ID = 12;

export function backendAgreement(
    overrides: Record<string, unknown> = {},
) {
    return {
        id: AGREEMENT_ID,
        portfolio: {
            id: 7,
            name: "NEXCODE Admin",
            slug: "nexcode-admin",
        },
        title: "Admin platform build",
        reference: "NX-2026-014",
        agreement_type: "project",
        currency: "RWF",
        total_amount: "1000000.00",
        agreement_date: "2026-09-01",
        start_date: "2026-09-02",
        end_date: null,
        status: "active",
        notes: "",
        created_at: "2026-09-01T09:00:00+00:00",
        updated_at: "2026-09-01T09:00:00+00:00",
        ...overrides,
    };
}

export function backendInstallment(
    overrides: Record<string, unknown> = {},
) {
    return {
        id: 31,
        agreement_id: AGREEMENT_ID,
        sequence: 1,
        title: "Down payment",
        installment_type: "down_payment",
        amount: "300000.00",
        due_type: "fixed_date",
        expected_due_date: "2026-09-10",
        due_date: "2026-09-10",
        milestone: null,
        grace_period_days: 5,
        is_waived: false,
        waived_at: null,
        waiver_reason: null,
        notes: "",
        financial: {
            expected_amount: "300000.00",
            paid_amount: "100000.00",
            outstanding_amount: "200000.00",
            payment_state: "partial",
            timing_state: "upcoming",
            effective_due_date: "2026-09-10",
        },
        created_at: "2026-09-01T09:00:00+00:00",
        updated_at: "2026-09-01T09:00:00+00:00",
        ...overrides,
    };
}

export function backendRecord(
    overrides: Record<string, unknown> = {},
) {
    return {
        id: 44,
        agreement_id: AGREEMENT_ID,
        amount: "100000.00",
        currency: "RWF",
        paid_at: "2026-09-05",
        payment_method: "mobile_money",
        reference: "MOMO-8812",
        notes: "",
        status: "posted",
        voided_at: null,
        void_reason: null,
        recorded_by: null,
        allocations: [
            {
                id: 51,
                installment_id: 31,
                installment_title: "Down payment",
                amount: "100000.00",
            },
        ],
        created_at: "2026-09-05T10:00:00+00:00",
        updated_at: "2026-09-05T10:00:00+00:00",
        ...overrides,
    };
}

export function backendAgreementSummary(
    overrides: Record<string, unknown> = {},
) {
    return {
        total_amount: "1000000.00",
        scheduled_amount: "1000000.00",
        received_amount: "100000.00",
        allocated_amount: "100000.00",
        unallocated_amount: "0.00",
        outstanding_amount: "900000.00",
        overpaid_amount: "0.00",
        waived_amount: "0.00",
        ...overrides,
    };
}

export function backendPortfolioSummary(
    overrides: Record<string, unknown> = {},
) {
    return {
        total_contracted: "1000000.00",
        total_received: "100000.00",
        outstanding: "900000.00",
        overdue: "0.00",
        agreement_count: 1,
        ...overrides,
    };
}

export function backendPagination(
    overrides: Record<string, unknown> = {},
) {
    return {
        page: 1,
        page_size: 20,
        total_items: 1,
        total_pages: 1,
        has_next: false,
        has_previous: false,
        ...overrides,
    };
}
