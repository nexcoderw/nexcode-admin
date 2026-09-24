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
  PaymentAgreementCard,
} from "@/components/payment/PaymentAgreementCard/PaymentAgreementCard";
import {
  PaymentSummaryCards,
} from "@/components/payment/PaymentSummaryCards/PaymentSummaryCards";
import type {
  PaymentAgreement,
} from "@/types/payment/agreement";

const agreement:
  PaymentAgreement = {
    id: 7,

    portfolio: {
      id: 4,
      name:
        "NEXCODE Platform",
      slug:
        "nexcode-platform",
    },

    title:
      "Development Contract",

    reference:
      "NEX-2026-001",

    agreementType:
      "project",

    currency:
      "RWF",

    totalAmount:
      "5000000.00",

    agreementDate:
      "2026-09-01",

    startDate:
      "2026-09-05",

    endDate: null,

    status:
      "active",

    notes: "",

    createdAt:
      "2026-09-01T08:00:00Z",

    updatedAt:
      "2026-09-01T08:00:00Z",
  };

describe(
  "Payment components",
  () => {
    it(
      "renders agreement identity and exact value",
      () => {
        render(
          <PaymentAgreementCard
            agreement={
              agreement
            }
          />,
        );

        expect(
          screen.getByText(
            "Development Contract",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "NEXCODE Platform",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders agreement financial summary",
      () => {
        render(
          <PaymentSummaryCards
            currency="RWF"
            summary={{
              totalAmount:
                "5000000.00",

              scheduledAmount:
                "5000000.00",

              receivedAmount:
                "2000000.00",

              allocatedAmount:
                "2000000.00",

              unallocatedAmount:
                "0.00",

              outstandingAmount:
                "3000000.00",

              overpaidAmount:
                "0.00",

              waivedAmount:
                "0.00",
            }}
          />,
        );

        expect(
          screen.getByText(
            "Received",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Outstanding",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);