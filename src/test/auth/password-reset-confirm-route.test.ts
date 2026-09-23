import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST,
} from "@/app/api/auth/password-reset/confirm/route";
import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { AUTH_API_ROUTES } from "@/constants/routes/auth-routes";
import {
    ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
    ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
} from "@/utils/auth/password-reset-session";
import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";
import {
    createJsonRequest,
} from "@/test/http";

const mocks = vi.hoisted(() => ({
    getAdminCsrf: vi.fn(),
    confirmReset: vi.fn(),
}));

vi.mock(
    "@/endpoints/auth/get-csrf",
    () => ({
        getAdminCsrf:
            mocks.getAdminCsrf,
    }),
);

vi.mock(
    "@/endpoints/auth/confirm-password-reset",
    () => ({
        confirmAdminPasswordReset:
            mocks.confirmReset,
    }),
);

describe(
    "POST password-reset/confirm",
    () => {
        beforeEach(() => {
            mocks.getAdminCsrf
                .mockResolvedValue({
                    token: "csrf-token",
                    cookie: "csrf-cookie",
                });
        });

        it(
            "uses the HttpOnly token and clears all authentication state",
            async () => {
                mocks.confirmReset
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: {
                            status: "success",
                            message:
                                "Password changed",
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .confirmPasswordReset,
                        {
                            password:
                                "NewPassword123!",
                            confirmPassword:
                                "NewPassword123!",
                        },
                        {
                            [ADMIN_PASSWORD_RESET_TOKEN_COOKIE]:
                                "private-token",
                        },
                    ),
                );

                expect(
                    mocks.confirmReset,
                ).toHaveBeenCalledWith(
                    {
                        resetToken:
                            "private-token",
                        password:
                            "NewPassword123!",
                        confirmPassword:
                            "NewPassword123!",
                    },
                    expect.any(Headers),
                    {
                        token: "csrf-token",
                        cookie: "csrf-cookie",
                    },
                );

                expect(
                    await response.json(),
                ).toEqual({
                    success: true,
                });

                const clearedCookies = [
                    ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
                    ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
                    ADMIN_SESSION_COOKIE_NAME,
                    ADMIN_CSRF_COOKIE_NAME,
                ];

                for (
                    const name of clearedCookies
                ) {
                    expect(
                        response.cookies.get(
                            name,
                        )?.value,
                    ).toBe("");
                }
            },
        );

        it(
            "rejects confirmation without reset authorization",
            async () => {
                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .confirmPasswordReset,
                        {
                            password:
                                "Password123!",
                            confirmPassword:
                                "Password123!",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(400);

                expect(
                    mocks.confirmReset,
                ).not.toHaveBeenCalled();

                expect(
                    await response.json(),
                ).toEqual({
                    success: false,
                    messageKey:
                        AUTH_MESSAGE_KEYS
                            .passwordResetSessionInvalid,
                });
            },
        );

        it(
            "does not expose Django password validation wording",
            async () => {
                mocks.confirmReset
                    .mockResolvedValue({
                        ok: false,
                        status: 400,
                        data: {
                            message:
                                "Internal password validator output",
                            errors: {
                                password: [
                                    "Internal detail",
                                ],
                            },
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .confirmPasswordReset,
                        {
                            password:
                                "Password123!",
                            confirmPassword:
                                "Password123!",
                        },
                        {
                            [ADMIN_PASSWORD_RESET_TOKEN_COOKIE]:
                                "private-token",
                        },
                    ),
                );

                const body =
                    await response.json();

                expect(body).toEqual({
                    success: false,
                    messageKey:
                        AUTH_MESSAGE_KEYS
                            .passwordResetRejected,
                });

                expect(
                    JSON.stringify(body),
                ).not.toContain(
                    "Internal detail",
                );
            },
        );
    },
);