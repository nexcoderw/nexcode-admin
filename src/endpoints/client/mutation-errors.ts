import "server-only";


const CLIENT_FIELDS = {
    name: "name",
    company_name: "companyName",
    email: "email",
    phone: "phone",
    website: "website",
    location: "location",
    profile_image: "profileImage",
    notes: "notes",
    status: "status",
    remove_profile_image:
        "removeProfileImage",
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
