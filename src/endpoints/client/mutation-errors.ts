import "server-only";


const CLIENT_FIELDS = {
    name: "name",
    email: "email",
    phone_number: "phoneNumber",
    __all__: "__all__",
} as const;


export function getClientErrorFields(
    value: unknown,
) {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return [];
    }

    const errors =
        (
            value as {
                errors?: unknown;
            }
        ).errors;

    if (
        !errors ||
        typeof errors !== "object" ||
        Array.isArray(errors)
    ) {
        return [];
    }

    return Object.keys(
        errors,
    )
        .filter(
            (
                field,
            ): field is keyof typeof CLIENT_FIELDS =>
                field in CLIENT_FIELDS,
        )
        .map(
            (field) =>
                CLIENT_FIELDS[
                    field
                ],
        );
}
