import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST,
} from "@/app/api/auth/login/route";
import { AUTH_MESSAGE_KEYS } from "@/constants/messages/auth-messages";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import { AUTH_API_ROUTES } from "@/constants/routes/auth-routes";
import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";
import {
    createJsonRequest,
} from "@/test/http";

const mocks = vi.hoisted(() => ({
    getAdminCsrf: vi.fn(),
    loginAdmin: vi.fn(),
    getSetCookieValue: vi.fn(),
}));

vi.mock(
    "@/endpoints/auth/get-csrf",
    () => ({
        getAdminCsrf:
            mocks.getAdminCsrf,
    }),
);

vi.mock(
    "@/endpoints/auth/login",
    () => ({
        loginAdmin:
            mocks.loginAdmin,
    }),
);

vi.mock(
    "@/utils/auth/backend-cookies",
    () => ({
        getSetCookieValue:
            mocks.getSetCookieValue,
    }),
);

describe(
    "POST /api/auth/login",
    () => {
        beforeEach(() => {
            mocks.getAdminCsrf
                .mockResolvedValue({
                    token: "csrf-token",
                    cookie: "csrf-cookie",
                });

            mocks.getSetCookieValue
                .mockImplementation(
                    (
                        _headers: Headers,
                        name: string,
                    ) => {
                        if (
                            name === "sessionid"
                        ) {
                            return "django-session";
                        }

                        if (
                            name === "csrftoken"
                        ) {
                            return "rotated-csrf";
                        }

                        return null;
                    },
                );
        });

        it(
            "stores Django credentials only in protected portal cookies",
            async () => {
                mocks.loginAdmin
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: {
                            status: "success",
                            message:
                                "Backend wording",
                            data: {
                                admin: {},
                            },
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.login,
                        {
                            email:
                                "Admin@Nexcode.Africa",
                            password:
                                "Password123!",
                            rememberMe: true,
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(200);

                expect(
                    await response.json(),
                ).toEqual({
                    success: true,
                });

                expect(
                    response.cookies.get(
                        ADMIN_SESSION_COOKIE_NAME,
                    )?.value,
                ).toBe(
                    "django-session",
                );

                expect(
                    response.cookies.get(
                        ADMIN_CSRF_COOKIE_NAME,
                    )?.value,
                ).toBe(
                    "rotated-csrf",
                );

                const setCookie =
                    response.headers.get(
                        "set-cookie",
                    ) ?? "";

                expect(setCookie).toMatch(
                    /HttpOnly/i,
                );

                expect(setCookie).toMatch(
                    /Secure/i,
                );

                expect(setCookie).toMatch(
                    /SameSite=Strict/i,
                );

                expect(setCookie).toMatch(
                    /Max-Age=604800/i,
                );

                expect(
                    mocks.loginAdmin,
                ).toHaveBeenCalledWith(
                    {
                        email:
                            "admin@nexcode.africa",
                        password:
                            "Password123!",
                        rememberMe: true,
                    },
                    expect.any(Headers),
                    {
                        token: "csrf-token",
                        cookie: "csrf-cookie",
                    },
                );
            },
        );

        it(
            "narrows a Django 401 without leaking backend details",
            async () => {
                mocks.loginAdmin
                    .mockResolvedValue({
                        ok: false,
                        status: 401,
                        data: {
                            message:
                                "DO NOT LEAK THIS",
                            correlationId:
                                "internal-reference",
                        },
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.login,
                        {
                            email:
                                "admin@nexcode.africa",
                            password: "wrong",
                        },
                    ),
                );

                const body =
                    await response.json();

                expect(
                    response.status,
                ).toBe(401);

                expect(body).toEqual({
                    success: false,
                    messageKey:
                        AUTH_MESSAGE_KEYS
                            .invalidCredentials,
                });

                expect(
                    JSON.stringify(body),
                ).not.toContain(
                    "DO NOT LEAK THIS",
                );
            },
        );

        it(
            "preserves a valid Retry-After value on throttling",
            async () => {
                mocks.loginAdmin
                    .mockResolvedValue({
                        ok: false,
                        status: 429,
                        data: null,
                        headers: new Headers({
                            "retry-after": "900",
                        }),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.login,
                        {
                            email:
                                "admin@nexcode.africa",
                            password: "wrong",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(429);

                expect(
                    response.headers.get(
                        "retry-after",
                    ),
                ).toBe("900");

                expect(
                    await response.json(),
                ).toEqual({
                    success: false,
                    messageKey:
                        AUTH_MESSAGE_KEYS
                            .tooManyAttempts,
                });
            },
        );

        it(
            "maps unexpected backend failure to 503",
            async () => {
                mocks.loginAdmin
                    .mockRejectedValue(
                        new Error(
                            "Backend offline",
                        ),
                    );

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.login,
                        {
                            email:
                                "admin@nexcode.africa",
                            password:
                                "Password123!",
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