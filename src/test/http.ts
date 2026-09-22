import {
    NextRequest,
} from "next/server";

const TEST_ORIGIN =
    "http://localhost:3000";

export function createJsonRequest(
    path: string,
    body: unknown,
    cookies: Record<string, string> = {},
) {
    const headers = createHeaders(
        cookies,
    );

    headers.set(
        "Content-Type",
        "application/json",
    );

    return new NextRequest(
        `${TEST_ORIGIN}${path}`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        },
    );
}

export function createGetRequest(
    path: string,
    cookies: Record<string, string> = {},
) {
    return new NextRequest(
        `${TEST_ORIGIN}${path}`,
        {
            method: "GET",
            headers: createHeaders(
                cookies,
            ),
        },
    );
}

function createHeaders(
    cookies: Record<string, string>,
) {
    const headers = new Headers();

    const cookieHeader =
        Object.entries(cookies)
            .map(
                ([name, value]) =>
                    `${name}=${encodeURIComponent(
                        value,
                    )}`,
            )
            .join("; ");

    if (cookieHeader) {
        headers.set(
            "Cookie",
            cookieHeader,
        );
    }

    return headers;
}