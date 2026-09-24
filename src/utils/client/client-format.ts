import type {
    ClientStatus,
} from "@/types/client/client";

export function getClientStatusLabel(
    status: ClientStatus,
) {
    if (status === "active") {
        return "Active";
    }

    if (status === "inactive") {
        return "Inactive";
    }

    return "Archived";
}

export function getClientStatusVariant(
    status: ClientStatus,
) {
    if (status === "active") {
        return "success" as const;
    }

    if (status === "inactive") {
        return "warning" as const;
    }

    return "neutral" as const;
}

export function formatClientDate(
    value: string,
) {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(date);
}