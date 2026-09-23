import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST,
} from "@/app/api/auth/password-reset/request/route";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
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
    requestReset: vi.fn(),
}));

vi.mock(
    "@/endpoints/auth/get-csrf",
    () => ({
        getAdminCsrf:
            mocks.getAdminCsrf,
    }),
);

vi.mock(
    "@/endpoints/auth/request-password-reset",
    () => ({
        requestAdminPasswordReset:
            mocks.requestReset,
    }),
);

describe(
    "POST password-reset/request",
    () => {
        beforeEach(() => {
            mocks.getAdminCsrf
                .mockResolvedValue({
                    token: "csrf-token",
                    cookie: "csrf-cookie",
                });
        });

        it(
            "stores the challenge in HttpOnly state and never exposes it in JSON",
            async () => {
                mocks.requestReset
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: {
                            status: "success",
                            message:
                                "Backend wording",
                            data: {
                                challenge_id:
                                    "challenge-123",
                            },
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .requestPasswordReset,
                        {
                            email:
                                "admin@nexcode.africa",
                        },
                    ),
                );

                const body =
                    await response.json();

                expect(body).toEqual({
                    success: true,
                });

                expect(
                    JSON.stringify(body),
                ).not.toContain(
                    "challenge-123",
                );

                expect(
                    response.cookies.get(
                        ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
                    )?.value,
                ).toBe(
                    "challenge-123",
                );

                expect(
                    response.cookies.get(
                        ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
                    )?.value,
                ).toBe("");

                const setCookie =
                    response.headers.get(
                        "set-cookie",
                    ) ?? "";

                expect(setCookie).toMatch(
                    /HttpOnly/i,
                );

                expect(setCookie).toMatch(
                    /SameSite=Strict/i,
                );

                expect(setCookie).toContain(
                    "Path=/api/auth/password-reset",
                );
            },
        );

        it(
            "maps an unexpected upstream failure to 503",
            async () => {
                mocks.requestReset
                    .mockResolvedValue({
                        ok: false,
                        status: 500,
                        data: {
                            message:
                                "Internal backend message",
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES
                            .requestPasswordReset,
                        {
                            email:
                                "admin@nexcode.africa",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(503);

                expect(
                    await response.json(),
                ).toEqual({
                    success: false,
                    messageKey:
                        COMMON_MESSAGE_KEYS
                            .serviceUnavailable,
                });
            },
        );
    },
);