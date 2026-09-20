import "server-only";

export function getSetCookieValue(
    headers: Headers,
    cookieName: string,
): string | null {
    const cookies =
        getSetCookieHeaders(headers);

    for (const cookie of cookies) {
        const firstPart =
            cookie.split(";", 1)[0]?.trim();

        if (!firstPart) {
            continue;
        }

        const separatorIndex =
            firstPart.indexOf("=");

        if (separatorIndex < 0) {
            continue;
        }

        const name = firstPart
            .slice(0, separatorIndex)
            .trim();

        if (name !== cookieName) {
            continue;
        }

        return firstPart.slice(
            separatorIndex + 1,
        );
    }

    return null;
}

function getSetCookieHeaders(
    headers: Headers,
): string[] {
    const values =
        typeof headers.getSetCookie === "function"
            ? headers.getSetCookie()
            : undefined;

    if (values && values.length > 0) {
        return values;
    }

    const combined =
        headers.get("set-cookie");

    if (!combined) {
        return [];
    }

    return combined.split(
        /,(?=\s*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=)/,
    );
}
