import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    confirmAdminPasswordReset,
} from "@/endpoints/auth/confirm-password-reset";
import {
    getAdminCsrf,
} from "@/endpoints/auth/get-csrf";
import {
    loginAdmin,
} from "@/endpoints/auth/login";
import {
    logoutAdmin,
} from "@/endpoints/auth/logout";
import {
    requestAdminPasswordReset,
} from "@/endpoints/auth/request-password-reset";
import {
    verifyAdminPasswordReset,
} from "@/endpoints/auth/verify-password-reset";

const mocks = vi.hoisted(() => ({
    backendRequest: vi.fn(),
}));

vi.mock(
    "@/endpoints/client",
    () => ({
        backendRequest:
            mocks.backendRequest,
    }),
);

describe(
    "administrator Django CSRF forwarding",
    () => {
        beforeEach(() => {
            mocks.backendRequest
                .mockResolvedValue({
                    ok: true,
                    status: 200,
                    data: null,
                    headers:
                        new Headers(),
                });
        });

        it(
            "acquires CSRF in the existing Django session when provided",
            async () => {
                mocks.backendRequest
                    .mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        data: {
                            status: "success",
                            data: {
                                csrf_token:
                                    "csrf-token",
                            },
                        },
                        headers: new Headers({
                            "set-cookie":
                                "csrftoken=csrf-cookie; Path=/",
                        }),
                    });

                const result =
                    await getAdminCsrf(
                        new Headers(),
                        "django-session",
                    );

                expect(result).toEqual({
                    token: "csrf-token",
                    cookie: "csrf-cookie",
                });

                expect(
                    mocks.backendRequest,
                ).toHaveBeenCalledWith(
                    "/api/admin/auth/csrf/",
                    {
                        method: "GET",
                        forwarded:
                            expect.any(Headers),
                        headers: {
                            Cookie:
                                "sessionid=django-session",
                        },
                    },
                );
            },
        );

        it(
            "forwards CSRF credentials on every authentication mutation",
            async () => {
                const forwarded =
                    new Headers();

                const csrf = {
                    token:
                        "csrf-form-token",
                    cookie:
                        "csrf-cookie",
                };

                await loginAdmin(
                    {
                        email:
                            "admin@nexcode.africa",
                        password:
                            "Password123!",
                        rememberMe: false,
                    },
                    forwarded,
                    csrf,
                );

                await requestAdminPasswordReset(
                    {
                        email:
                            "admin@nexcode.africa",
                    },
                    forwarded,
                    csrf,
                );

                await verifyAdminPasswordReset(
                    {
                        challengeId:
                            "challenge-id",
                        code: "123456",
                    },
                    forwarded,
                    csrf,
                );

                await confirmAdminPasswordReset(
                    {
                        resetToken:
                            "reset-token",
                        password:
                            "Password123!",
                        confirmPassword:
                            "Password123!",
                    },
                    forwarded,
                    csrf,
                );

                await logoutAdmin(
                    "django-session",
                    csrf,
                    forwarded,
                );

                expectCsrfHeaders(
                    mocks.backendRequest
                        .mock.calls[0][1],
                );

                expectCsrfHeaders(
                    mocks.backendRequest
                        .mock.calls[1][1],
                );

                expectCsrfHeaders(
                    mocks.backendRequest
                        .mock.calls[2][1],
                );

                expectCsrfHeaders(
                    mocks.backendRequest
                        .mock.calls[3][1],
                );

                const logoutOptions =
                    mocks.backendRequest
                        .mock.calls[4][1];

                expect(
                    logoutOptions.headers,
                ).toEqual(
                    expect.objectContaining({
                        "X-CSRFToken":
                            "csrf-form-token",
                    }),
                );

                expect(
                    logoutOptions.headers.Cookie,
                ).toContain(
                    "sessionid=django-session",
                );

                expect(
                    logoutOptions.headers.Cookie,
                ).toContain(
                    "csrftoken=csrf-cookie",
                );
            },
        );
    },
);

function expectCsrfHeaders(
    options: {
        headers?: Record<
            string,
            string
        >;
    },
) {
    expect(
        options.headers,
    ).toEqual(
        expect.objectContaining({
            Cookie:
                "csrftoken=csrf-cookie",
            "X-CSRFToken":
                "csrf-form-token",
        }),
    );
}