import {
    API_ROUTES,
} from "@/constants/routes";


export function getTeamImageSource(
    value: string | null,
) {
    if (!value) {
        return null;
    }

    if (
        value.startsWith(
            "/media/team/",
        )
    ) {
        const params =
            new URLSearchParams({
                path: value,
            });

        return (
            `${API_ROUTES.team.media}?` +
            params.toString()
        );
    }

    try {
        const url =
            new URL(value);

        if (
            url.protocol !== "https:" ||
            url.hostname !==
            "res.cloudinary.com"
        ) {
            return null;
        }

        return url.toString();
    } catch {
        return null;
    }
}