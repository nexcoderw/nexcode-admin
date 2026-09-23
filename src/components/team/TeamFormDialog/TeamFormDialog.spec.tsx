import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { TeamFormDialogTrigger } from "./TeamFormDialog";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
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

describe("TeamFormDialog", () => {
  it("opens the complete add workflow and closes without navigation", async () => {
    render(<TeamFormDialogTrigger mode="add" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Add team member" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Add team member" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Identity" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Profiles" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Media" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("dialog", { name: "Add team member" }),
    ).not.toBeInTheDocument();
  });
});
