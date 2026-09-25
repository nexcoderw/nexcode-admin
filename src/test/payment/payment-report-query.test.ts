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
          resolvePaymentReportQuery({
            portfolioId: "7",
            currency: "RWF",
            dateFrom: "2026-01-01",
            dateTo: "2026-09-25",
            dueWithinDays: "14",
            outstandingKind: "overdue",
            tab: "outstanding",
          }),
        ).toEqual({
          portfolioId: 7,
          currency: "RWF",
          dateFrom: "2026-01-01",
          dateTo: "2026-09-25",
          dueWithinDays: 14,
          outstandingKind: "overdue",
          tab: "outstanding",
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

    it(
      "defaults to collections",
      () => {
        const query =
          resolvePaymentReportQuery(
            {},
          );

        expect(
          query.tab,
        ).toBe(
          "collections",
        );
      },
    );

    it(
      "preserves report filters when changing tabs",
      async () => {
        const {
          buildPaymentReportTabHref,
        } = await import(
          "@/utils/payment/report-query"
        );

        const href =
          buildPaymentReportTabHref(
            {
              portfolioId: 9,
              currency: "RWF",
              dateFrom:
                "2026-01-01",
              dateTo:
                "2026-09-25",
              dueWithinDays: 14,
              outstandingKind:
                "overdue",
              tab:
                "collections",
            },
            "outstanding",
          );

        expect(
          href,
        ).toContain(
          "portfolioId=9",
        );

        expect(
          href,
        ).toContain(
          "currency=RWF",
        );

        expect(
          href,
        ).toContain(
          "tab=outstanding",
        );
      },
    );
  },
);