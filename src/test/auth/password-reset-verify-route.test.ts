import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST,
} from "@/app/api/auth/password-reset/verify/route";
import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { AUTH_API_ROUTES } from "@/constants/routes/auth-routes";
import {
    ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
    ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
} from "@/utils/auth/password-reset-session";
import {
    createJsonRequest,
} from "@/test/http";

const mocks = vi.hoisted(() => ({
    getAdminCsrf: vi.fn(),
    verifyReset: vi.fn(),
}));

vi.mock(
    "@/endpoints/auth/get-csrf",
    () => ({
        getAdminCsrf:
            mocks.getAdminCsrf,
    }),
);

vi.mock(
    "@/endpoints/auth/verify-password-reset",
    () => ({
        verifyAdminPasswordReset:
            mocks.verifyReset,
    }),
);

describe(
    "POST password-reset/verify",
    () => {
        beforeEach(() => {
            mocks.getAdminCsrf
                .mockResolvedValue({
                    token: "csrf-token",
                    cookie: "csrf-cookie",
                });
        });

        it(
            "exchanges the challenge for an HttpOnly reset token",
            async () => {
                mocks.verifyReset
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: {
                            status: "success",
                            message:
                                "Verified",
                            data: {
                                reset_token:
                                    "private-reset-token",
                            },
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .verifyPasswordReset,
                        {
                            code: "384271",
                        },
                        {
                            [ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE]:
                                "challenge-123",
                        },
                    ),
                );

                expect(
                    mocks.verifyReset,
                ).toHaveBeenCalledWith(
                    {
                        challengeId:
                            "challenge-123",
                        code: "384271",
                    },
                    expect.any(Headers),
                    {
                        token: "csrf-token",
                        cookie: "csrf-cookie",
                    },
                );

                const body =
                    await response.json();

                expect(body).toEqual({
                    success: true,
                });

                expect(
                    JSON.stringify(body),
                ).not.toContain(
                    "private-reset-token",
                );

                expect(
                    response.cookies.get(
                        ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
                    )?.value,
                ).toBe(
                    "private-reset-token",
                );

                expect(
                    response.cookies.get(
                        ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
                    )?.value,
                ).toBe("");
            },
        );

        it(
            "does not call Django when no challenge exists",
            async () => {
                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .verifyPasswordReset,
                        {
                            code: "384271",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(400);

                expect(
                    mocks.verifyReset,
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
            "narrows invalid verification responses",
            async () => {
                mocks.verifyReset
                    .mockResolvedValue({
                        ok: false,
                        status: 400,
                        data: {
                            message:
                                "Backend secret wording",
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .verifyPasswordReset,
                        {
                            code: "111111",
                        },
                        {
                            [ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE]:
                                "challenge-123",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(400);

                expect(
                    await response.json(),
                ).toEqual({
                    success: false,
                    messageKey:
                        AUTH_MESSAGE_KEYS
                            .passwordResetVerificationInvalid,
                });
            },
        );
    },
);