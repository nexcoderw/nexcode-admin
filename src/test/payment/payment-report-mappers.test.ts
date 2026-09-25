import {
  describe,
  expect,
  it,
} from "vitest";

import {
  mapReportOverview,
} from "@/endpoints/payment/report-mapper";

describe(
  "payment report mappers",
  () => {
    it(
      "keeps currencies separated",
      () => {
        const result =
          mapReportOverview(
            {
              as_of:
                "2026-09-25",

              due_within_days:
                30,

              currencies: [
                {
                  currency:
                    "RWF",

                  total_contracted:
                    "5000000.00",

                  total_received:
                    "2000000.00",

                  outstanding:
                    "3000000.00",

                  overdue:
                    "1000000.00",

                  due_soon:
                    "500000.00",

                  agreement_count:
                    2,

                  active_agreement_count:
                    1,
                },

                {
                  currency:
                    "USD",

                  total_contracted:
                    "1000.00",

                  total_received:
                    "250.00",

                  outstanding:
                    "750.00",

                  overdue:
                    "0.00",

                  due_soon:
                    "250.00",

                  agreement_count:
                    1,

                  active_agreement_count:
                    1,
                },
              ],
            },
          );

        expect(
          result?.currencies,
        ).toHaveLength(2);

        expect(
          result?.currencies[0]
            .currency,
        ).toBe("RWF");

        expect(
          result?.currencies[1]
            .currency,
        ).toBe("USD");
      },
    );
  },
);