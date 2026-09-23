import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { makePortfolioSummary } from "@/test/portfolio/fixtures";

import { PortfolioCard } from "./PortfolioCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

describe("PortfolioCard", () => {
  it("uses the protected local Portfolio media proxy", () => {
    render(<PortfolioCard portfolio={makePortfolioSummary()} />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/api/portfolio/media"),
    );
  });

  it("navigates to real detail and edit pages", () => {
    render(<PortfolioCard portfolio={makePortfolioSummary()} />);

    expect(
      screen.getByRole("link", {
        name: "Details",
      }),
    ).toHaveAttribute("href", "/portfolios/detail/7");

    expect(
      screen.getByRole("link", {
        name: "Edit",
      }),
    ).toHaveAttribute("href", "/portfolios/edit/7");
  });
});
