import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaymentDetailTabs } from "@/components/payment/PaymentDetailTabs/PaymentDetailTabs";
import {
  paymentDetailTabHref,
  resolvePaymentDetailTab,
} from "@/utils/payment/payment-detail-tabs";

describe("payment detail tabs", () => {
  it("resolves the tab from the URL, falling back to the schedule", () => {
    expect(resolvePaymentDetailTab("payments")).toBe("payments");
    expect(resolvePaymentDetailTab(["reminders", "payments"])).toBe("reminders");
    expect(resolvePaymentDetailTab(undefined)).toBe("schedule");
    expect(resolvePaymentDetailTab("ledger")).toBe("schedule");
  });

  it("keeps the plain URL for the default tab", () => {
    expect(paymentDetailTabHref(7, "schedule")).toBe("/payments/detail/7");
    expect(paymentDetailTabHref(7, "payments")).toBe(
      "/payments/detail/7?tab=payments",
    );
  });

  it("links every section and marks the current one", () => {
    render(
      <PaymentDetailTabs
        agreementId={7}
        active="payments"
        counts={{ schedule: 12, payments: 9 }}
      />,
    );

    const links = screen.getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Schedule12",
      "Payments9",
      "Reminders",
      "Notifications",
      "Settings",
    ]);

    const current = screen.getByRole("link", { current: "page" });

    expect(current).toHaveTextContent("Payments");
    expect(current).toHaveAttribute("href", "/payments/detail/7?tab=payments");
  });

  it("highlights counts that need attention", () => {
    render(
      <PaymentDetailTabs
        agreementId={7}
        active="schedule"
        counts={{ notifications: 3 }}
        highlight={["notifications"]}
      />,
    );

    expect(screen.getByText("3")).toHaveAttribute("data-highlight", "true");
  });
});
