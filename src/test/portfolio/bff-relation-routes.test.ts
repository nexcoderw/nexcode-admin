import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    POST as addDocumentRoute,
} from "@/app/api/portfolio/document/add/[portfolioId]/route";
import {
    POST as addImageRoute,
} from "@/app/api/portfolio/image/add/[portfolioId]/route";
import {
    PATCH as updateRepositoryRoute,
} from "@/app/api/portfolio/repository/update/[repositoryId]/route";
import {
    makePortfolioDetail,
} from "@/test/portfolio/fixtures";
import {
    createPortfolioRequest,
} from "@/test/portfolio/request";

const mocks =
    vi.hoisted(() => ({
        addImage: vi.fn(),
        addDocument:
            vi.fn(),
        editRepository:
            vi.fn(),
        runMutation:
            vi.fn(),
    }));

vi.mock(
    "@/endpoints/portfolio/add-portfolio-image",
    () => ({
        addPortfolioImage:
            mocks.addImage,
    }),
);

vi.mock(
    "@/endpoints/portfolio/add-portfolio-document",
    () => ({
        addPortfolioDocument:
            mocks.addDocument,
    }),
);

vi.mock(
    "@/endpoints/portfolio/edit-portfolio-repository",
    () => ({
        editPortfolioRepository:
            mocks.editRepository,
    }),
);

vi.mock(
    "@/utils/portfolio/portfolio-mutation",
    () => ({
        runPortfolioMutation:
            mocks.runMutation,
    }),
);

describe(
    "Portfolio relation BFF routes",
    () => {
        beforeEach(() => {
            mocks.runMutation
                .mockImplementation(
                    async (
                        _session:
                            string,
                        _stored:
                            string | null,
                        _headers:
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
                            cookie: "csrf",
                            token: "csrf",
                        }),
                );
        });

        it(
            "sanitizes Portfolio image FormData",
            async () => {
                const image =
                    makePortfolioDetail()
                        .images[0];

                mocks.addImage
                    .mockResolvedValue({
                        ok: true,
                        status: 201,
                        data: image,
                        fields: [],
                    });

                const submitted =
                    new FormData();

                submitted.set(
                    "image",
                    new File(
                        ["image"],
                        "project.png",
                        {
                            type:
                                "image/png",
                        },
                    ),
                );

                submitted.set(
                    "altText",
                    "Dashboard",
                );

                submitted.set(
                    "isCover",
                    "true",
                );

                submitted.set(
                    "slug",
                    "forbidden",
                );

                const response =
                    await addImageRoute(
                        createPortfolioRequest(
                            "/api/portfolio/image/add/7",
                            {
                                method: "POST",
                                formData:
                                    submitted,
                            },
                        ),
                        {
                            params:
                                Promise.resolve({
                                    portfolioId:
                                        "7",
                                }),
                        },
                    );

                expect(
                    response.status,
                ).toBe(201);

                const formData =
                    mocks.addImage
                        .mock.calls[0][1] as FormData;

                expect(
                    formData.get(
                        "alt_text",
                    ),
                ).toBe(
                    "Dashboard",
                );

                expect(
                    formData.has("slug"),
                ).toBe(false);
            },
        );

        it(
            "keeps Portfolio documents as title and URL only",
            async () => {
                const document =
                    makePortfolioDetail()
                        .documents[0];

                mocks.addDocument
                    .mockResolvedValue({
                        ok: true,
                        status: 201,
                        data: document,
                        fields: [],
                    });

                await addDocumentRoute(
                    createPortfolioRequest(
                        "/api/portfolio/document/add/7",
                        {
                            method: "POST",
                            json: {
                                title:
                                    "Proposal",
                                url:
                                    "https://example.com/proposal",
                                file:
                                    "forbidden.pdf",
                            },
                        },
                    ),
                    {
                        params:
                            Promise.resolve({
                                portfolioId:
                                    "7",
                            }),
                    },
                );

                expect(
                    mocks.addDocument,
                ).toHaveBeenCalledWith(
                    7,
                    {
                        title:
                            "Proposal",
                        url:
                            "https://example.com/proposal",
                    },
                    "django-session",
                    expect.any(Object),
                    expect.any(Headers),
                );
            },
        );

        it(
            "updates repositories through their independent endpoint",
            async () => {
                const repository =
                    makePortfolioDetail()
                        .repositories[0];

                mocks.editRepository
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        data: repository,
                        fields: [],
                    });

                const response =
                    await updateRepositoryRoute(
                        createPortfolioRequest(
                            "/api/portfolio/repository/update/31",
                            {
                                method: "PATCH",
                                json: {
                                    label:
                                        "GitHub",
                                    url:
                                        repository.url,
                                },
                            },
                        ),
                        {
                            params:
                                Promise.resolve({
                                    repositoryId:
                                        "31",
                                }),
                        },
                    );

                expect(
                    response.status,
                ).toBe(200);

                expect(
                    mocks.editRepository,
                ).toHaveBeenCalledWith(
                    31,
                    expect.objectContaining({
                        label: "GitHub",
                    }),
                    "django-session",
                    expect.any(Object),
                    expect.any(Headers),
                );
            },
        );
    },
);