import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    portfolioRequestHeaders,
} from "@/endpoints/portfolio/request-headers";
import {
    runPortfolioMutation,
} from "@/utils/portfolio/portfolio-mutation";

const mocks =
    vi.hoisted(() => ({
        getAdminCsrf:
            vi.fn(),
    }));

vi.mock(
    "@/endpoints/auth/get-csrf",
    () => ({
        getAdminCsrf:
            mocks.getAdminCsrf,
    }),
);

describe(
    "Portfolio CSRF handling",
    () => {
        beforeEach(() => {
            mocks.getAdminCsrf
                .mockReset();
        });

        it(
            "uses an existing protected CSRF cookie",
            async () => {
                const mutation =
                    vi.fn()
                        .mockResolvedValue({
                            status: 200,
                        });

                await runPortfolioMutation(
                    "session-id",
                    "stored-csrf",
                    new Headers(),
                    mutation,
                );

                expect(
                    mutation,
                ).toHaveBeenCalledWith({
                    cookie:
                        "stored-csrf",
                    token:
                        "stored-csrf",
                });

                expect(
                    mocks.getAdminCsrf,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "refreshes stale CSRF once after a 403",
            async () => {
                const mutation =
                    vi.fn()
                        .mockResolvedValueOnce({
                            status: 403,
                        })
                        .mockResolvedValueOnce({
                            status: 200,
                        });

                mocks.getAdminCsrf
                    .mockResolvedValue({
                        cookie:
                            "new-cookie",
                        token:
                            "new-token",
                    });

                const result =
                    await runPortfolioMutation(
                        "session-id",
                        "stale-csrf",
                        new Headers(),
                        mutation,
                    );

                expect(
                    result?.status,
                ).toBe(200);

                expect(
                    mutation,
                ).toHaveBeenCalledTimes(
                    2,
                );

                expect(
                    mutation,
                ).toHaveBeenLastCalledWith({
                    cookie:
                        "new-cookie",
                    token:
                        "new-token",
                });
            },
        );

        it(
            "puts session and CSRF only in backend request headers",
            () => {
                const headers =
                    portfolioRequestHeaders(
                        "django-session",
                        {
                            cookie:
                                "csrf-cookie",
                            token:
                                "csrf-token",
                        },
                    );

                expect(
                    headers.get(
                        "Cookie",
                    ),
                ).toContain(
                    "sessionid=django-session",
                );

                expect(
                    headers.get(
                        "Cookie",
                    ),
                ).toContain(
                    "csrftoken=csrf-cookie",
                );

                expect(
                    headers.get(
                        "X-CSRFToken",
                    ),
                ).toBe(
                    "csrf-token",
                );
            },
        );
    },
);