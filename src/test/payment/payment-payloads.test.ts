import {
    describe,
    expect,
    it,
} from "vitest";

import {
    sanitizeAgreementPayload,
} from "@/utils/payment/payloads";
import {
    sanitizeRecordPayload,
} from "@/utils/payment/record-payloads";

describe(
    "payment payloads",
    () => {
        it(
            "drops unknown agreement fields",
            () => {
                expect(
                    sanitizeAgreementPayload({
                        portfolioId: 4,
                        title:
                            "Contract",
                        totalAmount:
                            "1000000.00",

                        isAdmin: true,
                        backendUrl:
                            "secret",
                    }),
                ).toEqual({
                    portfolioId: 4,
                    title:
                        "Contract",
                    totalAmount:
                        "1000000.00",
                });
            },
        );

        it(
            "rejects invalid allocation shapes",
            () => {
                expect(
                    sanitizeRecordPayload({
                        amount:
                            "1000.00",

                        allocations: [
                            {
                                installmentId:
                                    "../7",

                                amount:
                                    "1000.00",
                            },
                        ],
                    }),
                ).toBeNull();
            },
        );
    },
);