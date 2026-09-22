import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    GET,
} from "@/app/api/auth/me/route";
import {
    MESSAGE_KEYS,
} from "@/constants/shared/messages";
import {
    API_ROUTES,
} from "@/constants/routes";
import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";
import {
    createGetRequest,
} from "@/test/http";

const mocks = vi.hoisted(() => ({
    getAdminMe: vi.fn(),
}));

vi.mock(
    "@/endpoints/auth/me",
    () => ({
        getAdminMe:
            mocks.getAdminMe,
    }),
);

describe(
    "GET /api/auth/me",
    () => {
        beforeEach(() => {
            mocks.getAdminMe
                .mockReset();
        });

        it(
            "rejects requests without a portal session",
            async () => {
                const response = await GET(
                    createGetRequest(
                        API_ROUTES.auth.me,
                    ),
                );

                expect(
                    response.status,
                ).toBe(401);

                expect(
                    mocks.getAdminMe,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "returns only the normalized administrator identity",
            async () => {
                mocks.getAdminMe
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        admin: {
                            id: 7,
                            email:
                                "admin@nexcode.africa",
                            firstName: "NEXCODE",
                            lastName: "Admin",
                            fullName:
                                "NEXCODE Admin",
                        },
                    });

                const response = await GET(
                    createGetRequest(
                        API_ROUTES.auth.me,
                        {
                            [ADMIN_SESSION_COOKIE_NAME]:
                                "django-session",
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
                    data: {
                        admin: {
                            id: 7,
                            email:
                                "admin@nexcode.africa",
                            firstName:
                                "NEXCODE",
                            lastName:
                                "Admin",
                            fullName:
                                "NEXCODE Admin",
                        },
                    },
                });
            },
        );

        it(
            "clears portal credentials when Django rejects the session",
            async () => {
                mocks.getAdminMe
                    .mockResolvedValue({
                        ok: false,
                        status: 401,
                        admin: null,
                    });

                const response = await GET(
                    createGetRequest(
                        API_ROUTES.auth.me,
                        {
                            [ADMIN_SESSION_COOKIE_NAME]:
                                "expired-session",
                        },
                    ),
                );

                expect(
                    response.status,
                ).toBe(401);

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

                const setCookie =
                    response.headers.get(
                        "set-cookie",
                    ) ?? "";

                expect(setCookie).toMatch(
                    /Max-Age=0/i,
                );
            },
        );

        it(
            "does not convert backend unavailability into an authentication failure",
            async () => {
                mocks.getAdminMe
                    .mockRejectedValue(
                        new Error(
                            "Backend unavailable",
                        ),
                    );

                const response = await GET(
                    createGetRequest(
                        API_ROUTES.auth.me,
                        {
                            [ADMIN_SESSION_COOKIE_NAME]:
                                "django-session",
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
                        MESSAGE_KEYS.common
                            .serviceUnavailable,
                });
            },
        );
    },
);