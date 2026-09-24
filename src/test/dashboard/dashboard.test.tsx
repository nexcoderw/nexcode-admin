import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AttentionPanel } from "@/components/dashboard/AttentionPanel/AttentionPanel";
import { CashflowChart } from "@/components/dashboard/CashflowChart/CashflowChart";
import { mapDashboardOverview } from "@/endpoints/dashboard/mapper";
import type { DashboardOverview } from "@/types/dashboard/dashboard";
import {
  niceMax,
  percentChange,
  relativeDays,
} from "@/utils/dashboard/dashboard-format";

function backendOverview(overrides: Record<string, unknown> = {}) {
  return {
    currency: "RWF",
    currencies: ["RWF"],
    today: "2026-09-25",
    money: {
      collected_this_month: "150000.00",
      collected_last_month: "150000.00",
      collected_this_year: "1350000.00",
      outstanding: "450000.00",
      overdue: "0.00",
      overdue_count: 0,
      expected_next_30_days: "150000.00",
    },
    counts: {
      active_agreements: 1,
      agreements: 1,
      unanswered_messages: 2,
      messages_this_month: 3,
      clients: 4,
      published_portfolios: 5,
      portfolios: 6,
      team_members: 7,
    },
    cashflow: [
      { month: "2026-08", expected: "150000.00", collected: "150000.00" },
      { month: "2026-09", expected: "150000.00", collected: "150000.00" },
      { month: "2026-10", expected: "150000.00", collected: null },
    ],
    messages_by_week: [{ week: "2026-09-21", count: 3 }],
    agreements_by_status: [{ status: "active", label: "Active", count: 1 }],
    portfolios_by_category: [
      { category: "web_application", label: "Web Application", count: 6 },
    ],
    alerts: {
      due_soon: [
        {
          installment_id: 10,
          agreement_id: 1,
          agreement_title: "Maintenance Contract",
          portfolio_name: "Talent Match Platform",
          title: "Maintenance 10",
          due_date: "2026-10-01",
          days: 6,
          outstanding: "150000.00",
          currency: "RWF",
          in_grace: false,
        },
      ],
      overdue: [],
      ending_soon: [],
    },
    recent_payments: [],
    ...overrides,
  };
}

function overview(overrides: Record<string, unknown> = {}) {
  return mapDashboardOverview(backendOverview(overrides)) as DashboardOverview;
}

describe("dashboard mapper", () => {
  it("maps the backend overview", () => {
    const data = overview();

    expect(data.money.collectedThisMonth).toBe("150000.00");
    expect(data.counts.unansweredMessages).toBe(2);
    expect(data.cashflow[2].collected).toBeNull();
    expect(data.alerts.dueSoon[0].agreementTitle).toBe("Maintenance Contract");
    expect(data.portfoliosByCategory[0].key).toBe("web_application");
  });

  it("rejects malformed money anywhere", () => {
    const money = { ...backendOverview().money, outstanding: "lots" };

    expect(mapDashboardOverview(backendOverview({ money }))).toBeNull();
    expect(
      mapDashboardOverview(
        backendOverview({
          cashflow: [{ month: "2026-09", expected: "1,000.00", collected: null }],
        }),
      ),
    ).toBeNull();
  });

  it("rejects an unknown currency", () => {
    expect(mapDashboardOverview(backendOverview({ currency: "BTC" }))).toBeNull();
  });
});

describe("dashboard formatting", () => {
  it("rounds axis tops to clean numbers", () => {
    expect(niceMax(0)).toBe(1);
    expect(niceMax(130000)).toBe(200000);
    expect(niceMax(150000)).toBe(200000);
    expect(niceMax(420)).toBe(500);
    expect(niceMax(1000)).toBe(1000);
  });

  it("describes days in words", () => {
    expect(relativeDays(0)).toBe("today");
    expect(relativeDays(1)).toBe("tomorrow");
    expect(relativeDays(6)).toBe("in 6 days");
    expect(relativeDays(3, true)).toBe("3 days overdue");
  });

  it("compares with the previous period", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
    expect(percentChange(100, 0)).toBeNull();
  });
});

describe("attention panel", () => {
  it("lists payments due within a week, in words", () => {
    render(<AttentionPanel alerts={overview().alerts} />);

    expect(screen.getByText("Due soon")).toBeInTheDocument();
    expect(screen.getByText("Maintenance 10")).toBeInTheDocument();
    expect(screen.getByText(/in 6 days/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Maintenance 10/ })).toHaveAttribute(
      "href",
      "/payments/detail/1",
    );
  });

  it("marks overdue and grace-period payments distinctly", () => {
    const [due] = overview().alerts.dueSoon;

    render(
      <AttentionPanel
        alerts={{
          dueSoon: [],
          endingSoon: [],
          overdue: [
            { ...due, installmentId: 1, days: 9 },
            { ...due, installmentId: 2, days: 2, inGrace: true },
          ],
        }}
      />,
    );

    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("In grace")).toBeInTheDocument();
    expect(screen.getByText(/9 days overdue/)).toBeInTheDocument();
  });

  it("says so when nothing needs attention", () => {
    render(<AttentionPanel alerts={{ dueSoon: [], overdue: [], endingSoon: [] }} />);

    expect(screen.getByText(/Nothing needs attention/)).toBeInTheDocument();
  });
});

describe("cashflow chart", () => {
  it("shows both figures for a month on hover", async () => {
    const user = userEvent.setup();

    render(
      <CashflowChart
        months={overview().cashflow}
        currency="RWF"
        currentMonth="2026-09"
      />,
    );

    await user.hover(screen.getByRole("button", { name: /September 2026/ }));

    expect(screen.getByText("September 2026")).toBeInTheDocument();
    expect(screen.getAllByText("collected").length).toBeGreaterThan(0);
  });

  it("names every month for keyboard and screen-reader users", () => {
    render(
      <CashflowChart
        months={overview().cashflow}
        currency="RWF"
        currentMonth="2026-09"
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: /October 2026: collected .* of .* expected/ }),
    ).toBeInTheDocument();
  });
});
