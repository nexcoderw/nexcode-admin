import {
    cookies,
    headers,
} from "next/headers";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    getAdminMe,
} from "@/endpoints/auth/me";

import {
    getCurrentAdmin,
} from "./current-admin";

vi.mock(
    "next/headers",
    () => ({
        cookies: vi.fn(),
        headers: vi.fn(),
    }),
);

vi.mock(
    "@/endpoints/auth/me",
    () => ({
        getAdminMe: vi.fn(),
    }),
);

describe(
    "getCurrentAdmin",
    () => {
        const mockedCookies =
            vi.mocked(cookies);

        const mockedHeaders =
            vi.mocked(headers);

        const mockedGetAdminMe =
            vi.mocked(getAdminMe);

        beforeEach(() => {
            mockedHeaders.mockResolvedValue(
                new Headers({
                    "user-agent":
                        "vitest",
                }) as never,
            );
        });

        it(
            "returns unauthenticated without a session cookie",
            async () => {
                mockedCookies.mockResolvedValue(
                    {
                        get: vi.fn(
                            () => undefined,
                        ),
                    } as never,
                );

                const result =
                    await getCurrentAdmin();

                expect(result).toEqual({
                    status:
                        "unauthenticated",
                });

                expect(
                    mockedGetAdminMe,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "restores a valid administrator",
            async () => {
                mockedCookies.mockResolvedValue(
                    {
                        get: vi.fn(
                            () => ({
                                value:
                                    "django-session",
                            }),
                        ),
                    } as never,
                );

                mockedGetAdminMe.mockResolvedValue(
                    {
                        ok: true,
                        status: 200,
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
                );

                const result =
                    await getCurrentAdmin();

                expect(result).toEqual({
                    status:
                        "authenticated",
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
                });

                expect(
                    mockedGetAdminMe,
                ).toHaveBeenCalledWith(
                    "django-session",
                    expect.any(Headers),
                );
            },
        );

        it(
            "treats a rejected backend session as unauthenticated",
            async () => {
                mockedCookies.mockResolvedValue(
                    {
                        get: vi.fn(
                            () => ({
                                value:
                                    "expired-session",
                            }),
                        ),
                    } as never,
                );

                mockedGetAdminMe.mockResolvedValue(
                    {
                        ok: false,
                        status: 401,
                        admin: null,
                    },
                );

                await expect(
                    getCurrentAdmin(),
                ).resolves.toEqual({
                    status:
                        "unauthenticated",
                });
            },
        );

        it(
            "distinguishes backend failure from logout",
            async () => {
                mockedCookies.mockResolvedValue(
                    {
                        get: vi.fn(
                            () => ({
                                value:
                                    "django-session",
                            }),
                        ),
                    } as never,
                );

                mockedGetAdminMe.mockRejectedValue(
                    new Error(
                        "Backend unavailable",
                    ),
                );

                await expect(
                    getCurrentAdmin(),
                ).resolves.toEqual({
                    status:
                        "unavailable",
                });
            },
        );
    },
);