import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolvePaymentReportQuery,
} from "@/utils/payment/report-query";

describe(
  "payment report query",
  () => {
    it(
      "resolves supported filters",
      () => {
        expect(
          resolvePaymentReportQuery(
            {
              portfolioId:
                "7",

              currency:
                "RWF",

              dateFrom:
                "2026-01-01",

              dateTo:
                "2026-09-25",

              dueWithinDays:
                "14",

              outstandingKind:
                "overdue",
            },
          ),
        ).toEqual({
          portfolioId: 7,
          currency: "RWF",

          dateFrom:
            "2026-01-01",

          dateTo:
            "2026-09-25",

          dueWithinDays:
            14,

          outstandingKind:
            "overdue",
        });
      },
    );

    it(
      "never allows an unlimited due window",
      () => {
        const query =
          resolvePaymentReportQuery(
            {
              dueWithinDays:
                "9999",
            },
          );

        expect(
          query.dueWithinDays,
        ).toBe(365);
      },
    );
  },
);