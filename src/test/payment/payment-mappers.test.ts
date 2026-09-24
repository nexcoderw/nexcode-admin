import { describe, expect, it } from "vitest";

import {
    mapAgreementListData,
    mapPaymentAgreement,
} from "@/endpoints/payment/agreement-mapper";
import { mapInstallment } from "@/endpoints/payment/installment-mapper";
import { mapPaymentRecord } from "@/endpoints/payment/record-mapper";
import {
    mapAgreementSummary,
    mapPortfolioSummary,
} from "@/endpoints/payment/summary-mapper";
import {
    backendAgreement,
    backendAgreementSummary,
    backendInstallment,
    backendPagination,
    backendPortfolioSummary,
    backendRecord,
} from "@/test/payment/fixtures";

/*
 * Decimal strings the backend never sends. Each must be refused rather
 * than shown as an amount.
 */
const MALFORMED_MONEY = [
    1000000,
    "abc",
    "",
    "1,000,000.00",
    "1000000.001",
    "1e6",
    " 1000.00",
    "NaN",
    null,
];

describe("payment agreement mapper", () => {
    it("maps a backend agreement, keeping money as its decimal string", () => {
        const agreement = mapPaymentAgreement(backendAgreement());

        expect(agreement).not.toBeNull();

        expect(
            agreement!.totalAmount,
        ).toBe(
            "1000000.00",
        );

        expect(agreement).toMatchObject({
            id: 12,
            portfolio: { id: 7, name: "NEXCODE Admin", slug: "nexcode-admin" },
            agreementType: "project",
            currency: "RWF",
            agreementDate: "2026-09-01",
            endDate: null,
            status: "active",
        });
    });

    it("rejects malformed monetary values", () => {
        for (const value of MALFORMED_MONEY) {
            expect(
                mapPaymentAgreement(backendAgreement({ total_amount: value })),
            ).toBeNull();
        }
    });

    it("rejects malformed entities", () => {
        for (const value of [
            null,
            [],
            "agreement",
            backendAgreement({ id: "12" }),
            backendAgreement({ portfolio: null }),
            backendAgreement({ portfolio: { id: 7, name: "NEXCODE Admin" } }),
            backendAgreement({ currency: "BTC" }),
            backendAgreement({ status: "paid" }),
            backendAgreement({ agreement_type: undefined }),
        ]) {
            expect(mapPaymentAgreement(value)).toBeNull();
        }
    });

    it("rejects a list when any item or the pagination is malformed", () => {
        expect(
            mapAgreementListData({
                items: [backendAgreement()],
                pagination: backendPagination(),
            })?.items,
        ).toHaveLength(1);

        expect(
            mapAgreementListData({
                items: [
                    backendAgreement(),
                    backendAgreement({ total_amount: "lots" }),
                ],
                pagination: backendPagination(),
            }),
        ).toBeNull();

        expect(
            mapAgreementListData({
                items: [backendAgreement()],
                pagination: backendPagination({ page: "1" }),
            }),
        ).toBeNull();
    });
});

describe("payment installment mapper", () => {
    it("maps the installment and its financial state", () => {
        const installment = mapInstallment(backendInstallment());

        expect(installment?.amount).toBe("300000.00");
        expect(installment?.financial).toMatchObject({
            expectedAmount: "300000.00",
            paidAmount: "100000.00",
            outstandingAmount: "200000.00",
            paymentState: "partial",
        });
    });

    it("rejects malformed amounts anywhere in the installment", () => {
        for (const value of MALFORMED_MONEY) {
            expect(
                mapInstallment(backendInstallment({ amount: value })),
            ).toBeNull();

            expect(
                mapInstallment(
                    backendInstallment({
                        financial: {
                            ...backendInstallment().financial,
                            outstanding_amount: value,
                        },
                    }),
                ),
            ).toBeNull();
        }
    });
});

describe("payment record mapper", () => {
    it("maps the record and its allocations", () => {
        const record = mapPaymentRecord(backendRecord());

        expect(record?.amount).toBe("100000.00");
        expect(record?.allocations).toEqual([
            {
                id: 51,
                installmentId: 31,
                installmentTitle: "Down payment",
                amount: "100000.00",
            },
        ]);
    });

    it("rejects malformed record and allocation amounts", () => {
        for (const value of MALFORMED_MONEY) {
            expect(
                mapPaymentRecord(backendRecord({ amount: value })),
            ).toBeNull();

            expect(
                mapPaymentRecord(
                    backendRecord({
                        allocations: [
                            {
                                ...backendRecord().allocations[0],
                                amount: value,
                            },
                        ],
                    }),
                ),
            ).toBeNull();
        }
    });

    it("rejects an unknown payment method", () => {
        expect(
            mapPaymentRecord(backendRecord({ payment_method: "crypto" })),
        ).toBeNull();
    });
});

describe("payment summary mappers", () => {
    it("maps agreement and portfolio summaries", () => {
        expect(
            mapAgreementSummary(backendAgreementSummary())?.outstandingAmount,
        ).toBe("900000.00");

        expect(mapPortfolioSummary(backendPortfolioSummary())).toEqual({
            totalContracted: "1000000.00",
            totalReceived: "100000.00",
            outstanding: "900000.00",
            overdue: "0.00",
            agreementCount: 1,
        });
    });

    it("rejects malformed summary amounts", () => {
        for (const value of MALFORMED_MONEY) {
            expect(
                mapAgreementSummary(
                    backendAgreementSummary({ received_amount: value }),
                ),
            ).toBeNull();

            expect(
                mapPortfolioSummary(
                    backendPortfolioSummary({ overdue: value }),
                ),
            ).toBeNull();
        }
    });
});
