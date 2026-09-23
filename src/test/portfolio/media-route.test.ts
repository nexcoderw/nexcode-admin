import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    GET,
} from "@/app/api/portfolio/media/route";
import {
    createPortfolioRequest,
} from "@/test/portfolio/request";

const mocks =
    vi.hoisted(() => ({
        backendBinaryRequest:
            vi.fn(),
    }));

vi.mock(
    "@/endpoints/client",
    () => ({
        backendBinaryRequest:
            mocks.backendBinaryRequest,
    }),
);

describe(
    "GET /api/portfolio/media",
    () => {
        beforeEach(() => {
            mocks.backendBinaryRequest
                .mockReset();
        });

        it(
            "requires an authenticated administrator",
            async () => {
                const response =
                    await GET(
                        createPortfolioRequest(
                            "/api/portfolio/media?path=/media/portfolios/demo/image.jpg",
                            {
                                authenticated:
                                    false,
                            },
                        ),
                    );

                expect(
                    response.status,
                ).toBe(401);
            },
        );

        it(
            "rejects traversal and arbitrary URLs",
            async () => {
                const traversal =
                    await GET(
                        createPortfolioRequest(
                            "/api/portfolio/media?path=/media/portfolios/../secret.jpg",
                        ),
                    );

                expect(
                    traversal.status,
                ).toBe(400);

                const remote =
                    await GET(
                        createPortfolioRequest(
                            "/api/portfolio/media?path=https://example.com/image.jpg",
                        ),
                    );

                expect(
                    remote.status,
                ).toBe(400);

                expect(
                    mocks.backendBinaryRequest,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "proxies only an allowed Portfolio image",
            async () => {
                mocks.backendBinaryRequest
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        body:
                            new Uint8Array([
                                1,
                                2,
                                3,
                            ]),
                        contentType:
                            "image/jpeg",
                    });

                const response =
                    await GET(
                        createPortfolioRequest(
                            "/api/portfolio/media?path=/media/portfolios/demo/image.jpg",
                        ),
                    );

                expect(
                    response.status,
                ).toBe(200);

                expect(
                    response.headers.get(
                        "content-type",
                    ),
                ).toBe(
                    "image/jpeg",
                );

                expect(
                    response.headers.get(
                        "x-content-type-options",
                    ),
                ).toBe(
                    "nosniff",
                );
            },
        );

        it(
            "rejects a non-image backend response",
            async () => {
                mocks.backendBinaryRequest
                    .mockResolvedValue({
                        ok: true,
                        status: 200,
                        body:
                            new Uint8Array([
                                1,
                            ]),
                        contentType:
                            "text/html",
                    });

                const response =
                    await GET(
                        createPortfolioRequest(
                            "/api/portfolio/media?path=/media/portfolios/demo/file.html",
                        ),
                    );

                expect(
                    response.status,
                ).toBe(415);
            },
        );
    },
);