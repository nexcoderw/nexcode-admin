import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { API_ROUTES, ROUTES } from "@/constants/routes";

import { AdminShell } from "./AdminShell";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
  usePathname: () => "/",
}));

describe("AdminShell logout", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  it("revokes the session and redirects to login", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          signedOut: true,
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
      <AdminShell
        admin={{
          name: "NEXCODE Admin",
          email: "admin@nexcode.africa",
        }}
      >
        <p>Protected content</p>
      </AdminShell>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /open account menu/i,
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: /sign out/i,
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(API_ROUTES.auth.logout, {
        method: "POST",
      });
    });

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith(ROUTES.auth.login);

      expect(navigation.refresh).toHaveBeenCalled();
    });
  });
});
