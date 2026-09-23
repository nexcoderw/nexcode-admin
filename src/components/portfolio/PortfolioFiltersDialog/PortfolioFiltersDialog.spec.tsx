import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { makeTeamMember } from "@/test/portfolio/fixtures";
import type { ResolvedPortfolioListQuery } from "@/utils/portfolio/portfolio-page-query";

import { PortfolioFiltersDialog } from "./PortfolioFiltersDialog";

const query: ResolvedPortfolioListQuery = {
  search: "admin",
  category: "web_application",
  projectType: "",
  status: "published",
  teamMemberId: 17,
  ordering: "-created_at",
  page: 1,
  pageSize: 12,
};

describe("PortfolioFiltersDialog", () => {
  it("opens the filter form in the allowed dialog", async () => {
    render(
      <PortfolioFiltersDialog query={query} teamMembers={[makeTeamMember()]} />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: /Filters/,
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Filter portfolios",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Search")).toHaveValue("admin");

    expect(screen.getByLabelText("Team member")).toHaveValue("17");

    expect(
      screen.getByRole("link", {
        name: "Reset",
      }),
    ).toHaveAttribute("href", "/portfolios");
  });
});
