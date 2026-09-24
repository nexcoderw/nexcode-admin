import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getClientImageSource,
} from "@/utils/client/client-image-source";


describe(
    "Client utilities",
    () => {
        it(
            "proxies local client images",
            () => {
                expect(
                    getClientImageSource(
                        "/media/clients/profiles/acme/profile.webp",
                    ),
                ).toBe(
                    "/api/client/media?path=%2Fmedia%2Fclients%2Fprofiles%2Facme%2Fprofile.webp",
                );
            },
        );

        it(
            "accepts only secure Cloudinary image URLs",
            () => {
                expect(
                    getClientImageSource(
                        "https://res.cloudinary.com/demo/image/upload/profile.webp",
                    ),
                ).toContain(
                    "res.cloudinary.com",
                );

                expect(
                    getClientImageSource(
                        "http://res.cloudinary.com/demo/image.webp",
                    ),
                ).toBeNull();

                expect(
                    getClientImageSource(
                        "https://example.com/profile.webp",
                    ),
                ).toBeNull();
            },
        );

        it(
            "rejects missing and malformed image sources",
            () => {
                expect(
                    getClientImageSource(
                        null,
                    ),
                ).toBeNull();

                expect(
                    getClientImageSource(
                        "not-a-url",
                    ),
                ).toBeNull();
            },
        );
    },
);
