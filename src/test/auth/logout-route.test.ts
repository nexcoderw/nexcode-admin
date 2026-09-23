import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST,
} from "@/app/api/auth/logout/route";
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
    logoutAdmin: vi.fn(),
}));

vi.mock(
    "@/endpoints/auth/get-csrf",
    () => ({
        getAdminCsrf:
            mocks.getAdminCsrf,
    }),
);

vi.mock(
    "@/endpoints/auth/logout",
    () => ({
        logoutAdmin:
            mocks.logoutAdmin,
    }),
);

describe(
    "POST /api/auth/logout",
    () => {
        beforeEach(() => {
            vi.spyOn(
                console,
                "error",
            ).mockImplementation(
                () => undefined,
            );
        });

        it(
            "revokes Django and clears both portal cookies",
            async () => {
                mocks.logoutAdmin
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: null,
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.logout,
                        {},
                        {
                            [ADMIN_SESSION_COOKIE_NAME]:
                                "django-session",
                            [ADMIN_CSRF_COOKIE_NAME]:
                                "stored-csrf",
                        },
                    ),
                );

                expect(
                    mocks.logoutAdmin,
                ).toHaveBeenCalledWith(
                    "django-session",
                    {
                        cookie:
                            "stored-csrf",
                        token:
                            "stored-csrf",
                    },
                    expect.any(Headers),
                );

                expect(
                    response.status,
                ).toBe(200);

                expect(
                    response.cookies.get(
                        ADMIN_SESSION_COOKIE_NAME,
                    )?.value,
                ).toBe("");

                expect(
                    response.cookies.get(
                        ADMIN_CSRF_COOKIE_NAME,
                    )?.value,
                ).toBe("");
            },
        );

        it(
            "renews CSRF and retries once after a Django 403",
            async () => {
                mocks.logoutAdmin
                    .mockResolvedValueOnce({
                        ok: false,
                        status: 403,
                        data: null,
                        headers:
                            new Headers(),
                    })
                    .mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        data: null,
                        headers:
                            new Headers(),
                    });

                mocks.getAdminCsrf
                    .mockResolvedValue({
                        token:
                            "fresh-token",
                        cookie:
                            "fresh-cookie",
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.logout,
                        {},
                        {
                            [ADMIN_SESSION_COOKIE_NAME]:
                                "django-session",
                            [ADMIN_CSRF_COOKIE_NAME]:
                                "stale-csrf",
                        },
                    ),
                );

                expect(
                    mocks.logoutAdmin,
                ).toHaveBeenCalledTimes(
                    2,
                );

                expect(
                    mocks.logoutAdmin,
                ).toHaveBeenLastCalledWith(
                    "django-session",
                    {
                        token:
                            "fresh-token",
                        cookie:
                            "fresh-cookie",
                    },
                    expect.any(Headers),
                );

                expect(
                    response.status,
                ).toBe(200);
            },
        );

        it(
            "clears local credentials even when Django revocation fails",
            async () => {
                mocks.logoutAdmin
                    .mockResolvedValue({
                        ok: false,
                        status: 500,
                        data: null,
                        headers:
                            new Headers(),
                    });

                const response = await POST(
                    createJsonRequest(
                        AUTH_API_ROUTES.logout,
                        {},
                        {
                            [ADMIN_SESSION_COOKIE_NAME]:
                                "django-session",
                            [ADMIN_CSRF_COOKIE_NAME]:
                                "csrf",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(503);

                expect(
                    response.cookies.get(
                        ADMIN_SESSION_COOKIE_NAME,
                    )?.value,
                ).toBe("");

                expect(
                    response.cookies.get(
                        ADMIN_CSRF_COOKIE_NAME,
                    )?.value,
                ).toBe("");
            },
        );
    },
);