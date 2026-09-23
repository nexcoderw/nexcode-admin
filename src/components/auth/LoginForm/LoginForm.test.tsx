import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { AUTH_API_ROUTES } from "@/constants/routes/auth-routes";

import {
    LoginForm,
} from "./LoginForm";

const navigation = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => navigation,
}));

describe("LoginForm", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal(
            "fetch",
            fetchMock,
        );
    });

    it(
        "submits credentials and redirects after successful login",
        async () => {
            const user = userEvent.setup();

            fetchMock.mockResolvedValue(
                new Response(
                    JSON.stringify({
                        success: true,
                    }),
                    {
                        status: 200,
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    },
                ),
            );

            render(<LoginForm />);

            await user.type(
                screen.getByLabelText(
                    /email address/i,
                ),
                "Admin@Nexcode.Africa",
            );

            await user.type(
                screen.getByLabelText(
                    /^password/i,
                ),
                "SecurePassword123!",
            );

            await user.click(
                screen.getByRole(
                    "checkbox",
                    {
                        name: /remember me/i,
                    },
                ),
            );

            await user.click(
                screen.getByRole(
                    "button",
                    {
                        name: /sign in/i,
                    },
                ),
            );

            await waitFor(() => {
                expect(
                    fetchMock,
                ).toHaveBeenCalledTimes(1);
            });

            const [
                url,
                options,
            ] = fetchMock.mock.calls[0];

            expect(url).toBe(
                AUTH_API_ROUTES.login,
            );

            expect(options).toEqual(
                expect.objectContaining({
                    method: "POST",
                }),
            );

            expect(
                JSON.parse(
                    String(options.body),
                ),
            ).toEqual({
                email:
                    "admin@nexcode.africa",
                password:
                    "SecurePassword123!",
                rememberMe: true,
            });

            await waitFor(() => {
                expect(
                    navigation.replace,
                ).toHaveBeenCalledWith(
                    ADMIN_ROUTES.dashboard,
                );

                expect(
                    navigation.refresh,
                ).toHaveBeenCalled();
            });
        },
    );

    it(
        "shows a safe error when credentials are rejected",
        async () => {
            const user = userEvent.setup();

            fetchMock.mockResolvedValue(
                new Response(
                    JSON.stringify({
                        success: false,
                        messageKey:
                            "auth.error.invalid_credentials",
                    }),
                    {
                        status: 401,
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    },
                ),
            );

            render(<LoginForm />);

            await user.type(
                screen.getByLabelText(
                    /email address/i,
                ),
                "admin@nexcode.africa",
            );

            await user.type(
                screen.getByLabelText(
                    /^password/i,
                ),
                "WrongPassword123!",
            );

            await user.click(
                screen.getByRole(
                    "button",
                    {
                        name: /sign in/i,
                    },
                ),
            );

            expect(
                await screen.findByRole(
                    "alert",
                ),
            ).toHaveTextContent(
                "Invalid email or password.",
            );

            expect(
                navigation.replace,
            ).not.toHaveBeenCalled();
        },
    );

    it(
        "validates the form before making a request",
        async () => {
            const user = userEvent.setup();

            render(<LoginForm />);

            await user.click(
                screen.getByRole(
                    "button",
                    {
                        name: /sign in/i,
                    },
                ),
            );

            expect(
                screen.getByText(
                    "Enter your email address.",
                ),
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    "Enter your password.",
                ),
            ).toBeInTheDocument();

            expect(
                fetchMock,
            ).not.toHaveBeenCalled();
        },
    );
});