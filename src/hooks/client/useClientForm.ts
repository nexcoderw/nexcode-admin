"use client";

import {
    useRouter,
} from "next/navigation";
import {
    useState,
} from "react";

import {
    AUTH_ROUTES,
} from "@/constants/routes/auth-routes";
import {
    CLIENT_API_ROUTES,
    CLIENT_ROUTES,
} from "@/constants/routes/client-routes";
import type {
    ClientDetail,
    ClientStatus,
} from "@/types/client/client";

interface UseClientFormOptions {
    mode: "add" | "edit";
    client?: ClientDetail;
}

export function useClientForm({
    mode,
    client,
}: UseClientFormOptions) {
    const router =
        useRouter();

    const [values, setValues] =
        useState(
            initialValues(
                client,
            ),
        );

    const [profileImage, setProfileImage] =
        useState<File | null>(
            null,
        );

    const [
        removeProfileImage,
        setRemoveProfileImage,
    ] = useState(false);

    const [saving, setSaving] =
        useState(false);

    const [fields, setFields] =
        useState<string[]>([]);

    const [error, setError] =
        useState<string | null>(
            null,
        );

    const [success, setSuccess] =
        useState(false);

    function setValue(
        key:
            keyof typeof values,
        value: string,
    ) {
        setValues(
            (current) => ({
                ...current,
                [key]: value,
            }),
        );
    }

    function selectImage(
        file: File | null,
    ) {
        setProfileImage(file);

        if (file) {
            setRemoveProfileImage(
                false,
            );
        }
    }

    function setRemoveImage(
        value: boolean,
    ) {
        setRemoveProfileImage(
            value,
        );

        if (value) {
            setProfileImage(null);
        }
    }

    async function submit() {
        setSaving(true);
        setError(null);
        setSuccess(false);
        setFields([]);

        try {
            const response =
                await fetch(
                    mode === "add"
                        ? CLIENT_API_ROUTES.add
                        : CLIENT_API_ROUTES.update(
                            client!.id,
                        ),
                    {
                        method:
                            mode === "add"
                                ? "POST"
                                : "PATCH",

                        credentials:
                            "same-origin",

                        headers: {
                            Accept:
                                "application/json",
                        },

                        body:
                            buildFormData(
                                values,
                                profileImage,
                                removeProfileImage,
                            ),
                    },
                );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                router.replace(
                    AUTH_ROUTES.login,
                );

                return;
            }

            const result =
                await response.json();

            if (!response.ok) {
                setFields(
                    Array.isArray(
                        result.fields,
                    )
                        ? result.fields
                        : [],
                );

                setError(
                    "Check the highlighted client fields.",
                );

                return;
            }

            if (mode === "add") {
                router.replace(
                    CLIENT_ROUTES.detail(
                        result.data.client.id,
                    ),
                );

                return;
            }

            setSuccess(true);
            router.refresh();
        } catch {
            setError(
                "The client could not be saved.",
            );
        } finally {
            setSaving(false);
        }
    }

    return {
        values,
        profileImage,
        removeProfileImage,
        saving,
        fields,
        error,
        success,
        setValue,
        selectImage,
        setRemoveImage,
        submit,
    };
}

function initialValues(
    client?: ClientDetail,
) {
    return {
        name:
            client?.name ?? "",

        companyName:
            client?.companyName ??
            "",

        email:
            client?.email ?? "",

        phone:
            client?.phone ?? "",

        website:
            client?.website ?? "",

        location:
            client?.location ?? "",

        notes:
            client?.notes ?? "",

        status:
            (
                client?.status ??
                "active"
            ) as ClientStatus,
    };
}

function buildFormData(
    values:
        ReturnType<
            typeof initialValues
        >,
    profileImage: File | null,
    removeProfileImage: boolean,
) {
    const data =
        new FormData();

    data.set(
        "name",
        values.name,
    );

    data.set(
        "companyName",
        values.companyName,
    );

    data.set(
        "email",
        values.email,
    );

    data.set(
        "phone",
        values.phone,
    );

    data.set(
        "website",
        values.website,
    );

    data.set(
        "location",
        values.location,
    );

    data.set(
        "notes",
        values.notes,
    );

    data.set(
        "status",
        values.status,
    );

    if (profileImage) {
        data.set(
            "profileImage",
            profileImage,
            profileImage.name,
        );
    }

    if (removeProfileImage) {
        data.set(
            "removeProfileImage",
            "true",
        );
    }

    return data;
}