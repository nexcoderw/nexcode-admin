import {
  describe,
  expect,
  it,
} from "vitest";

import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  buildPaymentListHref,
  resolvePaymentAgreementQuery,
} from "@/utils/payment/payment-page-query";

describe(
  "Payment page navigation",
  () => {
    it(
      "uses dedicated payment pages",
      () => {
        expect(
          PAYMENT_ROUTES.add,
        ).toBe(
          "/payments/add",
        );

        expect(
          PAYMENT_ROUTES.detail(
            7,
          ),
        ).toBe(
          "/payments/detail/7",
        );

        expect(
          PAYMENT_ROUTES.edit(
            7,
          ),
        ).toBe(
          "/payments/edit/7",
        );
      },
    );

    it(
      "resolves safe list filters",
      () => {
        const query =
          resolvePaymentAgreementQuery(
            {
              search:
                "Development",

              currency:
                "RWF",

              status:
                "active",

              page:
                "2",
            },
          );

        expect(
          query,
        ).toMatchObject({
          search:
            "Development",

          currency:
            "RWF",

          status:
            "active",

          page:
            2,

          pageSize:
            12,
        });
      },
    );

    it(
      "preserves filters during pagination",
      () => {
        const href =
          buildPaymentListHref(
            {
              search:
                "Portal",

              ordering:
                "-created_at",

              status:
                "active",

              page: 1,
              pageSize: 12,
            },

            2,
          );

        expect(
          href,
        ).toContain(
          "search=Portal",
        );

        expect(
          href,
        ).toContain(
          "status=active",
        );

        expect(
          href,
        ).toContain(
          "page=2",
        );
      },
    );
  },
);