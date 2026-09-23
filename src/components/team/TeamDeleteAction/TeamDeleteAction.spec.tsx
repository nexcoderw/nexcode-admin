import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { TeamDeleteAction } from "./TeamDeleteAction";

const push = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
    refresh,
  }),
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };

  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
});

describe("TeamDeleteAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    replace.mockReset();
    refresh.mockReset();
  });

  it("requires confirmation before deleting", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<TeamDeleteAction teamId={17} teamName="Jane Doe" />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByRole("dialog", { name: "Delete Jane Doe?" }),
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("deletes through the dedicated BFF route and returns to Team", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    render(<TeamDeleteAction teamId={17} teamName="Jane Doe" />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await userEvent.click(
      screen.getByRole("button", { name: "Delete permanently" }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/team/delete/17",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    expect(replace).toHaveBeenCalledWith("/team");
    expect(refresh).toHaveBeenCalled();
  });

  it("shows a safe error when deletion fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          message: "Internal Django exception",
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<TeamDeleteAction teamId={17} teamName="Jane Doe" />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await userEvent.click(
      screen.getByRole("button", { name: "Delete permanently" }),
    );

    expect(
      await screen.findByText(
        "The team member could not be deleted. Please try again shortly.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Internal Django exception"),
    ).not.toBeInTheDocument();
  });
});
