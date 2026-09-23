"use client";

import {
    useRouter,
} from "next/navigation";
import {
    useState,
} from "react";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { PORTFOLIO_API_ROUTES, PORTFOLIO_ROUTES } from "@/constants/routes/portfolio-routes";
import type {
    PortfolioDetail,
    PortfolioWriteInput,
} from "@/types/portfolio/portfolio";

interface UsePortfolioFormOptions {
    mode: "add" | "edit";

    portfolio?:
    PortfolioDetail;
}

export function usePortfolioForm({
    mode,
    portfolio,
}: UsePortfolioFormOptions) {
    const router =
        useRouter();

    const [values, setValues] =
        useState(() =>
            initialValues(portfolio),
        );

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
        value:
            string |
            number[],
    ) {
        setValues(
            (current) => ({
                ...current,
                [key]: value,
            }),
        );
    }

    function toggleTeam(
        teamId: number,
    ) {
        const selected =
            values.teamMemberIds;

        setValue(
            "teamMemberIds",
            selected.includes(teamId)
                ? selected.filter(
                    (id) =>
                        id !== teamId,
                )
                : [
                    ...selected,
                    teamId,
                ],
        );
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
                        ? PORTFOLIO_API_ROUTES.add
                        : PORTFOLIO_API_ROUTES.update(
                                portfolio!.id,
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

                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                buildPayload(
                                    values,
                                ),
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
                    "Check the highlighted portfolio fields.",
                );

                return;
            }

            if (mode === "add") {
                router.replace(
                    `${PORTFOLIO_ROUTES.edit(
                            result.data
                                .portfolio.id,
                        )
                    }?created=1`,
                );

                return;
            }

            setSuccess(true);
            router.refresh();
        } catch {
            setError(
                "The portfolio could not be saved.",
            );
        } finally {
            setSaving(false);
        }
    }

    return {
        values,
        saving,
        fields,
        error,
        success,
        setValue,
        toggleTeam,
        submit,
    };
}

function initialValues(
    portfolio?:
        PortfolioDetail,
) {
    return {
        name:
            portfolio?.name ?? "",

        summary:
            portfolio?.summary ?? "",

        description:
            portfolio?.description ??
            "",

        category:
            portfolio?.category ??
            "web_application",

        projectType:
            portfolio?.projectType ??
            "client_project",

        liveUrl:
            portfolio?.liveUrl ?? "",

        figmaUrl:
            portfolio?.figmaUrl ?? "",

        projectInitiationDate:
            portfolio
                ?.projectInitiationDate ??
            "",

        deadlineDate:
            portfolio?.deadlineDate ??
            "",

        status:
            portfolio?.status ??
            "draft",

        teamMemberIds:
            portfolio
                ?.teamMembers
                .map(
                    (member) =>
                        member.id,
                ) ?? [],
    };
}

function buildPayload(
    values:
        ReturnType<
            typeof initialValues
        >,
): PortfolioWriteInput {
    return {
        name: values.name,
        summary: values.summary,
        description:
            values.description,
        category:
            values.category,
        projectType:
            values.projectType,
        liveUrl:
            values.liveUrl,
        figmaUrl:
            values.figmaUrl,

        projectInitiationDate:
            values
                .projectInitiationDate ||
            null,

        deadlineDate:
            values.deadlineDate ||
            null,

        status:
            values.status,

        teamMemberIds:
            values.teamMemberIds,
    };
}