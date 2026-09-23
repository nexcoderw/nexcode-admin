import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makePortfolioDetail, makeTeamMember } from "@/test/portfolio/fixtures";

import { PortfolioForm } from "./PortfolioForm";

const replace = vi.fn();

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

describe("PortfolioForm", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
  });

  it("creates a Portfolio and continues to its edit page", async () => {
    const portfolio = makePortfolioDetail();

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            portfolio,
          },
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<PortfolioForm mode="add" teamMembers={[makeTeamMember()]} />);

    await userEvent.type(screen.getByLabelText(/Name/), "NEXCODE Admin");

    await userEvent.click(screen.getByLabelText("Jane Doe"));

    await userEvent.click(
      screen.getByRole("button", {
        name: "Create portfolio",
      }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];

    expect(url).toBe("/api/portfolio/add");

    expect(options?.method).toBe("POST");

    expect(JSON.parse(String(options?.body))).toEqual(
      expect.objectContaining({
        name: "NEXCODE Admin",
        category: "web_application",
        projectType: "client_project",
        teamMemberIds: [17],
      }),
    );

    expect(replace).toHaveBeenCalledWith("/portfolios/edit/7?created=1");
  });

  it("updates an existing Portfolio through PATCH", async () => {
    const portfolio = makePortfolioDetail();

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            portfolio,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(
      <PortfolioForm
        mode="edit"
        portfolio={portfolio}
        teamMembers={[makeTeamMember()]}
      />,
    );

    const name = screen.getByLabelText(/Name/);

    await userEvent.clear(name);

    await userEvent.type(name, "Updated Project");

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save changes",
      }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/portfolio/update/7",
        expect.objectContaining({
          method: "PATCH",
        }),
      );
    });

    expect(refresh).toHaveBeenCalled();
  });

  it("maps stable validation fields to the form", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          fields: ["liveUrl"],
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(
      <PortfolioForm
        mode="edit"
        portfolio={makePortfolioDetail()}
        teamMembers={[makeTeamMember()]}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save changes",
      }),
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Live URL")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });
});
