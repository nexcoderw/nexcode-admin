import "server-only";

const ALLOWED_FIELDS = new Set([
    "name",
    "position",
    "image",
    "image_png",
    "linkedin",
    "github",
    "remove_image",
    "remove_image_png",
    "__all__",
]);

interface BackendValidationResponse {
    errors?: unknown;
}

export function getTeamErrorFields(
    value: unknown,
): string[] {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return [];
    }

    const response =
        value as BackendValidationResponse;

    if (
        !response.errors ||
        typeof response.errors !==
        "object" ||
        Array.isArray(
            response.errors,
        )
    ) {
        return [];
    }

    return Object.keys(
        response.errors,
    ).filter(
        (field) =>
            ALLOWED_FIELDS.has(field),
    );
}