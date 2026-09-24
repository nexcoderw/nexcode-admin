import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AddPortfolioPage from "@/app/(dashboard)/portfolios/add/page";
import PortfolioDetailsPage from "@/app/(dashboard)/portfolios/detail/[id]/page";
import EditPortfolioPage from "@/app/(dashboard)/portfolios/edit/[id]/page";
import { makePortfolioDetail, makeTeamMember } from "@/test/portfolio/fixtures";

const mocks = vi.hoisted(() => ({
  getContext: vi.fn(),
  listTeam: vi.fn(),
  getPortfolio: vi.fn(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
  notFound: mocks.notFound,
}));

vi.mock("@/utils/portfolio/portfolio-server-data", () => ({
  getPortfolioServerContext: mocks.getContext,
  listPortfolioTeamMembers: mocks.listTeam,
}));

vi.mock("@/endpoints/portfolio/get-portfolio", () => ({
  getPortfolio: mocks.getPortfolio,
}));

vi.mock("@/components/portfolio/PortfolioForm/PortfolioForm", () => ({
  PortfolioForm: ({ mode }: { mode: string }) => (
    <div data-testid={`portfolio-form-${mode}`} />
  ),
}));

vi.mock(
  "@/components/portfolio/PortfolioImageManager/PortfolioImageManager",
  () => ({
    PortfolioImageManager: () => <div data-testid="image-manager" />,
  }),
);

vi.mock(
  "@/components/portfolio/PortfolioDocumentManager/PortfolioDocumentManager",
  () => ({
    PortfolioDocumentManager: () => <div data-testid="document-manager" />,
  }),
);

vi.mock(
  "@/components/portfolio/PortfolioRepositoryManager/PortfolioRepositoryManager",
  () => ({
    PortfolioRepositoryManager: () => <div data-testid="repository-manager" />,
  }),
);

vi.mock(
  "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction",
  () => ({
    PortfolioDeleteAction: () => (
      <button type="button">Delete portfolio</button>
    ),
  }),
);

describe("Portfolio administration pages", () => {
  beforeEach(() => {
    mocks.getContext.mockResolvedValue({
      sessionId: "django-session",
      forwarded: new Headers(),
    });

    mocks.listTeam.mockResolvedValue({
      ok: true,
      status: 200,
      items: [makeTeamMember()],
    });

    mocks.getPortfolio.mockResolvedValue({
      ok: true,
      status: 200,
      portfolio: makePortfolioDetail(),
    });
  });

  it("renders Portfolio creation as an actual page", async () => {
    render(await AddPortfolioPage());

    expect(
      screen.getByRole("heading", {
        name: "Add portfolio",
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("portfolio-form-add")).toBeInTheDocument();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders Portfolio editing as an actual page", async () => {
    const user = userEvent.setup();

    render(
      await EditPortfolioPage({
        params: Promise.resolve({
          id: "7",
        }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Edit NEXCODE Admin",
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("portfolio-form-edit")).toBeInTheDocument();

    // The workspace shows one section at a time; each tab opens its manager.
    for (const [tab, manager] of [
      ["Images", "image-manager"],
      ["Documents", "document-manager"],
      ["Repositories", "repository-manager"],
    ]) {
      await user.click(screen.getByRole("tab", { name: new RegExp(`^${tab}`) }));

      expect(screen.getByTestId(manager)).toBeInTheDocument();
    }
  });

  it("renders details as a dedicated route", async () => {
    render(
      await PortfolioDetailsPage({
        params: Promise.resolve({
          id: "7",
        }),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "NEXCODE Admin",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Edit portfolio",
      }),
    ).toHaveAttribute("href", "/portfolios/edit/7");
  });
});
