import { PORTFOLIO_API_ROUTES } from "@/constants/routes/portfolio-routes";

export function getPortfolioImageSource(
    value: string | null,
) {
    if (!value) {
        return null;
    }

    if (
        value.startsWith(
            "/media/portfolios/",
        )
    ) {
        const params =
            new URLSearchParams({
                path: value,
            });

        return (
            `${PORTFOLIO_API_ROUTES.media}?` +
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