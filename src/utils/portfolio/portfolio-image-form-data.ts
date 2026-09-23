export function sanitizePortfolioImageFormData(
    input: FormData,
): FormData | null {
    const output =
        new FormData();

    const image =
        input.get("image");

    if (
        image instanceof File &&
        image.size > 0
    ) {
        output.set(
            "image",
            image,
            image.name,
        );
    }

    const altText =
        input.get("altText");

    if (
        altText !== null
    ) {
        if (
            typeof altText !==
            "string"
        ) {
            return null;
        }

        output.set(
            "alt_text",
            altText,
        );
    }

    const isCover =
        input.get("isCover");

    if (
        isCover !== null
    ) {
        if (
            typeof isCover !==
            "string" ||
            ![
                "true",
                "false",
            ].includes(
                isCover.toLowerCase(),
            )
        ) {
            return null;
        }

        output.set(
            "is_cover",
            isCover.toLowerCase(),
        );
    }

    const position =
        input.get("position");

    if (
        position !== null
    ) {
        if (
            typeof position !==
            "string" ||
            !/^\d+$/.test(
                position,
            )
        ) {
            return null;
        }

        output.set(
            "position",
            position,
        );
    }

    return output;
}