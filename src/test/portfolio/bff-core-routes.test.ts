import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST as addPortfolioRoute,
} from "@/app/api/portfolio/add/route";
import {
    DELETE as deletePortfolioRoute,
} from "@/app/api/portfolio/delete/[id]/route";
import {
    GET as detailPortfolioRoute,
} from "@/app/api/portfolio/detail/[id]/route";
import {
    GET as listPortfolioRoute,
} from "@/app/api/portfolio/list/route";
import {
    PATCH as updatePortfolioRoute,
} from "@/app/api/portfolio/update/[id]/route";
import {
    makePortfolioDetail,
    makePortfolioSummary,
} from "@/test/portfolio/fixtures";
import {
    createPortfolioRequest,
} from "@/test/portfolio/request";

const mocks =
    vi.hoisted(() => ({
        listPortfolios:
            vi.fn(),
        getPortfolio:
            vi.fn(),
        addPortfolio:
            vi.fn(),
        editPortfolio:
            vi.fn(),
        deletePortfolio:
            vi.fn(),
        runPortfolioMutation:
            vi.fn(),
    }));

vi.mock(
    "@/endpoints/portfolio/list-portfolios",
    () => ({
        listPortfolios:
            mocks.listPortfolios,
    }),
);

vi.mock(
    "@/endpoints/portfolio/get-portfolio",
    () => ({
        getPortfolio:
            mocks.getPortfolio,
    }),
);

vi.mock(
    "@/endpoints/portfolio/add-portfolio",
    () => ({
        addPortfolio:
            mocks.addPortfolio,
    }),
);

vi.mock(
    "@/endpoints/portfolio/edit-portfolio",
    () => ({
        editPortfolio:
            mocks.editPortfolio,
    }),
);

vi.mock(
    "@/endpoints/portfolio/delete-portfolio",
    () => ({
        deletePortfolio:
            mocks.deletePortfolio,
    }),
);

vi.mock(
    "@/utils/portfolio/portfolio-mutation",
    () => ({
        runPortfolioMutation:
            mocks.runPortfolioMutation,
    }),
);

describe(
    "Portfolio core BFF routes",
    () => {
        beforeEach(() => {
            mocks.runPortfolioMutation
                .mockImplementation(
                    async (
                        _sessionId:
                            string,
                        _stored:
                            string | null,
                        _forwarded:
                            Headers,
                        mutation:
                            (
                                csrf: {
                                    cookie: string;
                                    token: string;
                                },
                            ) =>
                                Promise<unknown>,
                    ) =>
                        mutation({
                            cookie:
                                "csrf-cookie",
                            token:
                                "csrf-token",
                        }),
                );
        });

        it(
            "requires authentication for listing",
            async () => {
                const response =
                    await listPortfolioRoute(
                        createPortfolioRequest(
                            "/api/portfolio/list",
                            {
                                authenticated:
                                    false,
                            },
                        ),
                    );

                expect(
                    response.status,
                ).toBe(401);

                expect(
                    mocks.listPortfolios,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "forwards validated list filters",
            async () => {
                mocks.listPortfolios
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: {
                            items: [
                                makePortfolioSummary(),
                            ],
                            pagination: {
                                page: 2,
                                pageSize: 12,
                                totalItems: 13,
                                totalPages: 2,
                                hasNext: false,
                                hasPrevious: true,
                            },
                        },
                    });

                const response =
                    await listPortfolioRoute(
                        createPortfolioRequest(
                            "/api/portfolio/list?status=published&page=2",
                        ),
                    );

                expect(
                    response.status,
                ).toBe(200);

                expect(
                    mocks.listPortfolios,
                ).toHaveBeenCalledWith(
                    "django-session",
                    expect.any(Headers),
                    expect.objectContaining({
                        status:
                            "published",
                        page: 2,
                    }),
                );
            },
        );

        it(
            "maps a missing Portfolio to a stable 404",
            async () => {
                mocks.getPortfolio
                    .mockResolvedValue({
                        ok: false,
                        status: 404,
                        portfolio: null,
                    });

                const response =
                    await detailPortfolioRoute(
                        createPortfolioRequest(
                            "/api/portfolio/detail/7",
                        ),
                        {
                            params:
                                Promise.resolve({
                                    id: "7",
                                }),
                        },
                    );

                expect(
                    response.status,
                ).toBe(404);
            },
        );

        it(
            "sanitizes Portfolio creation before the endpoint call",
            async () => {
                const portfolio =
                    makePortfolioDetail();

                mocks.addPortfolio
                    .mockResolvedValue({
                        ok: true,
                        status: 201,
                        data: portfolio,
                        fields: [],
                    });

                const response =
                    await addPortfolioRoute(
                        createPortfolioRequest(
                            "/api/portfolio/add",
                            {
                                method: "POST",
                                json: {
                                    id: 999,
                                    slug: "forced",
                                    name:
                                        "NEXCODE Admin",
                                    category:
                                        "web_application",
                                    projectType:
                                        "client_project",
                                    status:
                                        "draft",
                                },
                            },
                        ),
                    );

                expect(
                    response.status,
                ).toBe(201);

                expect(
                    mocks.addPortfolio,
                ).toHaveBeenCalledWith(
                    {
                        name:
                            "NEXCODE Admin",
                        category:
                            "web_application",
                        projectType:
                            "client_project",
                        status:
                            "draft",
                    },
                    "django-session",
                    expect.any(Object),
                    expect.any(Headers),
                );

                expect(
                    JSON.stringify(
                        await response.json(),
                    ),
                ).not.toContain(
                    "django-session",
                );
            },
        );

        it(
            "maps update validation fields without backend error text",
            async () => {
                mocks.editPortfolio
                    .mockResolvedValue({
                        ok: false,
                        status: 400,
                        data: null,
                        fields: [
                            "liveUrl",
                        ],
                    });

                const response =
                    await updatePortfolioRoute(
                        createPortfolioRequest(
                            "/api/portfolio/update/7",
                            {
                                method: "PATCH",
                                json: {
                                    liveUrl:
                                        "invalid",
                                },
                            },
                        ),
                        {
                            params:
                                Promise.resolve({
                                    id: "7",
                                }),
                        },
                    );

                expect(
                    response.status,
                ).toBe(400);

                expect(
                    await response.json(),
                ).toEqual(
                    expect.objectContaining({
                        success: false,
                        fields: [
                            "liveUrl",
                        ],
                    }),
                );
            },
        );

        it(
            "deletes through the dedicated Portfolio route",
            async () => {
                mocks.deletePortfolio
                    .mockResolvedValue({
                        ok: true,
                        status: 204,
                    });

                const response =
                    await deletePortfolioRoute(
                        createPortfolioRequest(
                            "/api/portfolio/delete/7",
                            {
                                method:
                                    "DELETE",
                            },
                        ),
                        {
                            params:
                                Promise.resolve({
                                    id: "7",
                                }),
                        },
                    );

                expect(
                    response.status,
                ).toBe(200);

                expect(
                    mocks.deletePortfolio,
                ).toHaveBeenCalledWith(
                    7,
                    "django-session",
                    expect.any(Object),
                    expect.any(Headers),
                );
            },
        );
    },
);