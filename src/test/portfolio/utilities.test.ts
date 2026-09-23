import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parsePortfolioResourceId,
} from "@/utils/portfolio/portfolio-id";
import {
    sanitizePortfolioImageFormData,
} from "@/utils/portfolio/portfolio-image-form-data";
import {
    getPortfolioImageSource,
} from "@/utils/portfolio/portfolio-image-source";
import {
    sanitizePortfolioDocumentPayload,
    sanitizePortfolioPayload,
    sanitizePortfolioRepositoryPayload,
} from "@/utils/portfolio/portfolio-json-payload";
import {
    buildPortfolioListHref,
    resolvePortfolioListQuery,
} from "@/utils/portfolio/portfolio-page-query";

describe(
    "Portfolio input utilities",
    () => {
        it(
            "keeps only supported Portfolio fields",
            () => {
                expect(
                    sanitizePortfolioPayload({
                        id: 999,
                        slug: "forced-slug",
                        name: "NEXCODE",
                        category:
                            "web_application",
                        projectType:
                            "client_project",
                        status: "draft",
                        teamMemberIds: [
                            17,
                        ],
                        createdAt:
                            "forbidden",
                    }),
                ).toEqual({
                    name: "NEXCODE",
                    category:
                        "web_application",
                    projectType:
                        "client_project",
                    status: "draft",
                    teamMemberIds: [
                        17,
                    ],
                });
            },
        );

        it(
            "rejects unsupported enum values",
            () => {
                expect(
                    sanitizePortfolioPayload({
                        name: "Project",
                        category:
                            "not-a-category",
                    }),
                ).toBeNull();
            },
        );

        it(
            "keeps document links file-free",
            () => {
                expect(
                    sanitizePortfolioDocumentPayload({
                        title: "Proposal",
                        url:
                            "https://example.com/proposal",
                        file:
                            "should-not-pass",
                        id: 3,
                    }),
                ).toEqual({
                    title: "Proposal",
                    url:
                        "https://example.com/proposal",
                });
            },
        );

        it(
            "restricts repository payload fields",
            () => {
                expect(
                    sanitizePortfolioRepositoryPayload({
                        label: "GitHub",
                        url:
                            "https://github.com/example",
                        portfolioId: 100,
                    }),
                ).toEqual({
                    label: "GitHub",
                    url:
                        "https://github.com/example",
                });
            },
        );

        it(
            "normalizes Portfolio image FormData",
            () => {
                const input =
                    new FormData();

                input.set(
                    "altText",
                    "Dashboard",
                );

                input.set(
                    "position",
                    "2",
                );

                input.set(
                    "isCover",
                    "true",
                );

                input.set(
                    "slug",
                    "forbidden",
                );

                const output =
                    sanitizePortfolioImageFormData(
                        input,
                    );

                expect(
                    output?.get(
                        "alt_text",
                    ),
                ).toBe(
                    "Dashboard",
                );

                expect(
                    output?.get(
                        "position",
                    ),
                ).toBe("2");

                expect(
                    output?.get(
                        "is_cover",
                    ),
                ).toBe("true");

                expect(
                    output?.has("slug"),
                ).toBe(false);
            },
        );
    },
);

describe(
    "Portfolio navigation utilities",
    () => {
        it(
            "resolves valid filters and builds a stable list URL",
            () => {
                const query =
                    resolvePortfolioListQuery({
                        search: "admin",
                        category:
                            "web_application",
                        status:
                            "published",
                        page: "2",
                    });

                expect(
                    buildPortfolioListHref(
                        query,
                        3,
                    ),
                ).toContain(
                    "/portfolios?",
                );

                expect(
                    buildPortfolioListHref(
                        query,
                        3,
                    ),
                ).toContain(
                    "page=3",
                );
            },
        );

        it(
            "accepts only positive safe identifiers",
            () => {
                expect(
                    parsePortfolioResourceId(
                        "17",
                    ),
                ).toBe(17);

                expect(
                    parsePortfolioResourceId(
                        "0",
                    ),
                ).toBeNull();

                expect(
                    parsePortfolioResourceId(
                        "../17",
                    ),
                ).toBeNull();
            },
        );

        it(
            "proxies only local Portfolio media or Cloudinary",
            () => {
                expect(
                    getPortfolioImageSource(
                        "/media/portfolios/demo/image.jpg",
                    ),
                ).toContain(
                    "/api/portfolio/media",
                );

                expect(
                    getPortfolioImageSource(
                        "https://res.cloudinary.com/demo/image/upload/test.jpg",
                    ),
                ).toContain(
                    "res.cloudinary.com",
                );

                expect(
                    getPortfolioImageSource(
                        "https://example.com/image.jpg",
                    ),
                ).toBeNull();

                expect(
                    getPortfolioImageSource(
                        "http://res.cloudinary.com/demo/image.jpg",
                    ),
                ).toBeNull();
            },
        );
    },
);