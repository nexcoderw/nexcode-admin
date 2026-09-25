import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  PaymentReceipt,
} from "@/components/payment/PaymentReceipt/PaymentReceipt";
import {
  PaymentStatement,
} from "@/components/payment/PaymentStatement/PaymentStatement";
import {
  PAYMENT_API_ROUTES,
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import type {
  PaymentPortfolioStatement,
  PaymentReceipt as PaymentReceiptData,
} from "@/types/payment/report";

const receipt:
  PaymentReceiptData = {
    receiptNumber:
      "NEX-PAY-000012",

    issuedAt:
      "2026-09-25T10:00:00Z",

    portfolio: {
      id: 4,
      name:
        "Client Portal",
    },

    agreement: {
      id: 7,
      title:
        "Development Contract",

      reference:
        "NEX-2026-007",
    },

    payment: {
      id: 12,

      amount:
        "500000.00",

      currency:
        "RWF",

      paidAt:
        "2026-09-25T09:00:00Z",

      paymentMethod:
        "bank_transfer",

      reference:
        "BK-001",

      status:
        "posted",

      voidedAt:
        null,

      voidReason:
        null,

      recordedBy:
        "admin",
    },

    allocations: [
      {
        installmentId: 31,

        installmentTitle:
          "Down payment",

        amount:
          "500000.00",
      },
    ],
  };

const statement:
  PaymentPortfolioStatement = {
    generatedAt:
      "2026-09-25T10:30:00Z",

    portfolio: {
      id: 4,
      name:
        "Client Portal",

      slug:
        "client-portal",
    },

    currencies: [
      {
        currency:
          "RWF",

        totalContracted:
          "2000000.00",

        totalReceived:
          "500000.00",

        outstanding:
          "1500000.00",
      },
    ],

    agreements: [
      {
        id: 7,

        title:
          "Development Contract",

        reference:
          "NEX-2026-007",

        status:
          "active",

        currency:
          "RWF",

        totalAmount:
          "2000000.00",

        receivedAmount:
          "500000.00",

        outstandingAmount:
          "1500000.00",

        startDate:
          "2026-09-01",

        endDate:
          null,
      },
    ],

    payments: [
      {
        id: 12,

        receiptNumber:
          "NEX-PAY-000012",

        agreementId: 7,

        agreementTitle:
          "Development Contract",

        currency:
          "RWF",

        amount:
          "500000.00",

        paidAt:
          "2026-09-25T09:00:00Z",

        status:
          "posted",

        paymentMethod:
          "bank_transfer",

        reference:
          "BK-001",
      },
    ],
  };

describe(
  "payment reporting routes",
  () => {
    it(
      "defines the reporting page",
      () => {
        expect(
          PAYMENT_ROUTES.reports,
        ).toBe(
          "/payments/reports",
        );
      },
    );

    it(
      "builds a Portfolio statement route",
      () => {
        expect(
          PAYMENT_ROUTES.statement(
            4,
          ),
        ).toBe(
          "/payments/reports/statement/4",
        );
      },
    );

    it(
      "builds a payment receipt route",
      () => {
        expect(
          PAYMENT_ROUTES.receipt(
            12,
          ),
        ).toBe(
          "/payments/reports/receipt/12",
        );
      },
    );

    it(
      "builds the statement BFF route",
      () => {
        expect(
          PAYMENT_API_ROUTES
            .reportStatement(
              4,
            ),
        ).toBe(
          "/api/payment/report/statement/4",
        );
      },
    );

    it(
      "builds the receipt BFF route",
      () => {
        expect(
          PAYMENT_API_ROUTES
            .reportReceipt(
              12,
            ),
        ).toBe(
          "/api/payment/report/receipt/12",
        );
      },
    );
  },
);

describe(
  "PaymentReceipt",
  () => {
    it(
      "renders the receipt identity",
      () => {
        render(
          <PaymentReceipt
            receipt={receipt}
          />,
        );

        expect(
          screen.getByText(
            "Payment receipt",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "NEX-PAY-000012",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the Portfolio and agreement",
      () => {
        render(
          <PaymentReceipt
            receipt={receipt}
          />,
        );

        expect(
          screen.getByText(
            "Client Portal",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Development Contract",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the payment allocation",
      () => {
        render(
          <PaymentReceipt
            receipt={receipt}
          />,
        );

        expect(
          screen.getByText(
            "Down payment",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the transaction reference",
      () => {
        render(
          <PaymentReceipt
            receipt={receipt}
          />,
        );

        expect(
          screen.getByText(
            "BK-001",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);

describe(
  "PaymentStatement",
  () => {
    it(
      "renders the Portfolio statement identity",
      () => {
        render(
          <PaymentStatement
            statement={
              statement
            }
          />,
        );

        expect(
          screen.getByText(
            "Payment statement",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Client Portal",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders agreement information",
      () => {
        render(
          <PaymentStatement
            statement={
              statement
            }
          />,
        );

        expect(
          screen.getAllByText(
            "Development Contract",
          ).length,
        ).toBeGreaterThan(0);

        expect(
          screen.getByText(
            "active",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the receipt link",
      () => {
        render(
          <PaymentStatement
            statement={
              statement
            }
          />,
        );

        const link =
          screen.getByRole(
            "link",
            {
              name:
                "NEX-PAY-000012",
            },
          );

        expect(
          link,
        ).toHaveAttribute(
          "href",
          "/payments/reports/receipt/12",
        );
      },
    );

    it(
      "keeps the currency visible",
      () => {
        render(
          <PaymentStatement
            statement={
              statement
            }
          />,
        );

        expect(
          screen.getAllByText(
            /RWF/,
          ).length,
        ).toBeGreaterThan(0);
      },
    );
  },
);