import "server-only";

import {
    CLIENT_STATUSES,
} from "@/constants/client/client-options";


const MAX_IMAGE_BYTES =
    10 * 1024 * 1024;

const IMAGE_TYPES =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

const TEXT_FIELDS = {
    name: "name",
    companyName: "company_name",
    email: "email",
    phone: "phone",
    website: "website",
    location: "location",
    notes: "notes",
    status: "status",

    removeProfileImage:
        "remove_profile_image",
} as const;


export function sanitizeClientFormData(
    input: FormData,
): FormData | null {
    const output =
        new FormData();

    for (
        const [
            source,
            destination,
        ]
        of Object.entries(
            TEXT_FIELDS,
        )
    ) {
        const value =
            input.get(source);

        if (value === null) {
            continue;
        }

        if (
            typeof value !== "string"
        ) {
            return null;
        }

        if (
            source === "status" &&
            !isClientStatus(value)
        ) {
            return null;
        }

        output.set(
            destination,
            value,
        );
    }

    const image =
        input.get(
            "profileImage",
        );

    if (image !== null) {
        if (!(image instanceof File)) {
            return null;
        }

        if (image.size > 0) {
            if (
                image.size >
                    MAX_IMAGE_BYTES ||
                !IMAGE_TYPES.has(
                    image.type,
                )
            ) {
                return null;
            }

            output.set(
                "profile_image",
                image,
                image.name,
            );
        }
    }

    return output;
}


function isClientStatus(
    value: string,
) {
    return (
        CLIENT_STATUSES as
        readonly string[]
    ).includes(value);
}