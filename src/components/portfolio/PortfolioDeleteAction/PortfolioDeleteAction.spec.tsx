import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PortfolioDeleteAction } from "./PortfolioDeleteAction";

const replace = vi.fn();

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

describe("PortfolioDeleteAction", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
  });

  it("requires confirmation before deleting", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(
      <PortfolioDeleteAction
        resource="portfolio"
        resourceId={7}
        name="NEXCODE Admin"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Delete NEXCODE Admin",
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Delete NEXCODE Admin?",
      }),
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("uses the dedicated delete BFF route", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 200,
        },
      ),
    );

    render(
      <PortfolioDeleteAction
        resource="portfolio"
        resourceId={7}
        name="NEXCODE Admin"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Delete NEXCODE Admin",
      }),
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Delete permanently",
      }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/portfolio/delete/7",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    expect(replace).toHaveBeenCalledWith("/portfolios");

    expect(refresh).toHaveBeenCalled();
  });

  it("never displays raw backend failure text", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Django stack trace",
        }),
        {
          status: 503,
        },
      ),
    );

    render(
      <PortfolioDeleteAction
        resource="portfolio"
        resourceId={7}
        name="NEXCODE Admin"
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Delete NEXCODE Admin",
      }),
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Delete permanently",
      }),
    );

    expect(
      await screen.findByText("The portfolio could not be deleted."),
    ).toBeInTheDocument();

    expect(screen.queryByText("Django stack trace")).not.toBeInTheDocument();
  });
});
