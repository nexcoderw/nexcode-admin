import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parseAgreementQuery,
} from "@/utils/payment/agreement-query";

describe(
    "payment agreement query",
    () => {
        it(
            "parses supported filters",
            () => {
                const params =
                    new URLSearchParams({
                        search:
                            "Website",

                        ordering:
                            "-created_at",

                        portfolioId:
                            "7",

                        currency:
                            "RWF",

                        page:
                            "2",

                        pageSize:
                            "20",
                    });

                expect(
                    parseAgreementQuery(
                        params,
                    ),
                ).toEqual({
                    search:
                        "Website",

                    ordering:
                        "-created_at",

                    portfolioId:
                        7,

                    currency:
                        "RWF",

                    page:
                        2,

                    pageSize:
                        20,
                });
            },
        );

        it(
            "rejects unsupported ordering",
            () => {
                expect(
                    parseAgreementQuery(
                        new URLSearchParams({
                            ordering:
                                "DROP TABLE",
                        }),
                    ),
                ).toBeNull();
            },
        );

        it(
            "rejects oversized pages",
            () => {
                expect(
                    parseAgreementQuery(
                        new URLSearchParams({
                            pageSize:
                                "500",
                        }),
                    ),
                ).toBeNull();
            },
        );
    },
);