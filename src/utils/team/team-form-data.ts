import "server-only";

const TEXT_FIELDS = [
    "name",
    "position",
    "linkedin",
    "github",
    "remove_image",
    "remove_image_png",
] as const;

const FILE_FIELDS = [
    "image",
    "image_png",
] as const;

export function sanitizeTeamFormData(
    input: FormData,
) {
    const output =
        new FormData();

    for (
        const field
        of TEXT_FIELDS
    ) {
        const value =
            input.get(field);

        if (
            typeof value === "string"
        ) {
            output.set(
                field,
                value,
            );
        }
    }

    for (
        const field
        of FILE_FIELDS
    ) {
        const value =
            input.get(field);

        if (
            value instanceof File &&
            value.size > 0
        ) {
            output.set(
                field,
                value,
                value.name,
            );
        }
    }

    return output;
}