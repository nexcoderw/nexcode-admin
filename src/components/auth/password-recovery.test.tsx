import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForgotPasswordForm } from "@/components/auth/forgot-password/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/reset-password/ResetPasswordForm";
import { VerificationForm } from "@/components/auth/verify/VerificationForm";
import { API_ROUTES, ROUTES } from "@/constants/routes";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
}));

describe("administrator password recovery", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  it("requests a code and navigates to verification", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue(successResponse());

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByLabelText(/email address/i),
      "Admin@Nexcode.Africa",
    );

    await user.click(
      screen.getByRole("button", {
        name: /send verification code/i,
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe(API_ROUTES.auth.requestPasswordReset);

    expect(JSON.parse(String(options.body))).toEqual({
      email: "admin@nexcode.africa",
    });

    expect(navigation.push).toHaveBeenCalledWith(ROUTES.auth.verify);
  });

  it("verifies the six-digit code and opens password reset", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue(successResponse());

    render(<VerificationForm />);

    await user.type(screen.getByLabelText(/verification code/i), "384271");

    await user.click(
      screen.getByRole("button", {
        name: /verify/i,
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe(API_ROUTES.auth.verifyPasswordReset);

    expect(JSON.parse(String(options.body))).toEqual({
      code: "384271",
    });

    expect(navigation.replace).toHaveBeenCalledWith(ROUTES.auth.resetPassword);
  });

  it("changes the password and returns to login", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue(successResponse());

    render(<ResetPasswordForm />);

    const password = "NewSecurePassword123!";

    await user.type(screen.getByLabelText(/new password/i), password);

    await user.type(screen.getByLabelText(/confirm password/i), password);

    await user.click(
      screen.getByRole("button", {
        name: /reset password/i,
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe(API_ROUTES.auth.confirmPasswordReset);

    expect(JSON.parse(String(options.body))).toEqual({
      password,
      confirmPassword: password,
    });

    expect(navigation.replace).toHaveBeenCalledWith(ROUTES.auth.login);

    expect(navigation.refresh).toHaveBeenCalled();
  });

  it("shows the safe verification error returned by the BFF", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          messageKey: "auth.error.password_reset_verification_invalid",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<VerificationForm />);

    await user.type(screen.getByLabelText(/verification code/i), "111111");

    await user.click(
      screen.getByRole("button", {
        name: /verify/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The verification code is invalid or has expired.",
    );

    expect(navigation.replace).not.toHaveBeenCalled();
  });
});

function successResponse() {
  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
