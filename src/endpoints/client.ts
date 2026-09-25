import "server-only";

const BACKEND_REQUEST_TIMEOUT_MS = 10_000;

/*
 * File uploads get a longer limit than ordinary requests. The backend
 * resizes and re-encodes every image before it replies, and aborting
 * mid-way is worse than waiting: the backend still commits the change,
 * so the admin would report a failure for an update that succeeded.
 */
const BACKEND_UPLOAD_TIMEOUT_MS = 30_000;

const FORWARDED_HEADERS = [
    "x-device-id",
    "x-device-type",
    "x-device-platform",
    "x-device-os-version",
    "x-app-version",
    "x-forwarded-for",
] as const;

export interface BackendRequestOptions {
    method?:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

    body?: unknown;

    formData?: FormData;

    forwarded?: Headers;

    headers?: HeadersInit;
}

export interface BackendResult<T> {
    ok: boolean;
    status: number;
    data: T | null;
    headers: Headers;
}

export interface BackendBinaryResult {
    ok: boolean;
    status: number;
    body: ArrayBuffer | null;
    contentType: string | null;
}

export interface BackendBinaryRequestOptions {
    forwarded?: Headers;
    headers?: HeadersInit;
    accept?: string;
}

export async function backendBinaryRequest(
    path: string,
    options:
        BackendBinaryRequestOptions = {},
): Promise<BackendBinaryResult> {
    const controller =
        new AbortController();

    const timeout = setTimeout(
        () =>
            controller.abort(),
        BACKEND_REQUEST_TIMEOUT_MS,
    );

    const headers =
        new Headers(
            options.headers,
        );

    headers.set(
        "Accept",
        options.accept ??
        "image/avif,image/webp,image/png,image/jpeg",
    );

    if (
        options.forwarded
    ) {
        forwardRequestHeaders(
            options.forwarded,
            headers,
        );
    }

    try {
        const response =
            await fetch(
                buildBackendUrl(
                    path,
                ),
                {
                    method: "GET",
                    headers,
                    cache: "no-store",
                    signal:
                        controller.signal,
                },
            );

        return {
            ok: response.ok,

            status:
                response.status,

            body:
                response.ok
                    ? await response
                        .arrayBuffer()
                    : null,

            contentType:
                response.headers.get(
                    "content-type",
                ),
        };
    } catch (error) {
        console.error(
            "Backend binary request failed.",
            {
                route: path,

                error:
                    error instanceof Error
                        ? error.name
                        : "UnknownError",
            },
        );

        throw error;
    } finally {
        clearTimeout(
            timeout,
        );
    }
}

const backendApiUrl = getBackendApiUrl();

export async function backendRequest<T>(
    path: string,
    options: BackendRequestOptions = {},
): Promise<BackendResult<T>> {
    if (
        options.body !== undefined &&
        options.formData !== undefined
    ) {
        throw new Error(
            "A backend request cannot contain both JSON and FormData.",
        );
    }

    const headers = new Headers(
        options.headers,
    );

    headers.set(
        "Accept",
        "application/json",
    );

    if (options.body !== undefined) {
        headers.set(
            "Content-Type",
            "application/json",
        );
    }

    if (options.forwarded) {
        forwardRequestHeaders(
            options.forwarded,
            headers,
        );
    }

    const controller =
        new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        options.formData !== undefined
            ? BACKEND_UPLOAD_TIMEOUT_MS
            : BACKEND_REQUEST_TIMEOUT_MS,
    );

    try {
        const response = await fetch(
            buildBackendUrl(path),
            {
                method:
                    options.method ?? "GET",

                headers,

                body:
                    options.formData ??
                    (
                        options.body === undefined
                            ? undefined
                            : JSON.stringify(
                                options.body,
                            )
                    ),

                cache: "no-store",

                signal:
                    controller.signal,
            },
        );

        return {
            ok: response.ok,
            status: response.status,
            data:
                await readJsonResponse<T>(
                    response,
                ),
            headers:
                response.headers,
        };
    } catch (error) {
        console.error(
            "Backend request failed.",
            {
                route: path,
                error:
                    error instanceof Error
                        ? error.name
                        : "UnknownError",
            },
        );

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function getBackendApiUrl() {
    const value =
        process.env.BACKEND_API_URL?.trim();

    if (!value) {
        throw new Error(
            "BACKEND_API_URL is not configured.",
        );
    }

    let url: URL;

    try {
        url = new URL(value);
    } catch {
        throw new Error(
            "BACKEND_API_URL must be a valid URL.",
        );
    }

    if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
    ) {
        throw new Error(
            "BACKEND_API_URL must use HTTP or HTTPS.",
        );
    }

    return url.toString().replace(/\/+$/, "");
}

function buildBackendUrl(path: string) {
    const normalizedPath = path.startsWith("/")
        ? path
        : `/${path}`;

    return `${backendApiUrl}${normalizedPath}`;
}

function forwardRequestHeaders(
    source: Headers,
    destination: Headers,
) {
    for (const headerName of FORWARDED_HEADERS) {
        const value = source.get(headerName);

        if (value) {
            destination.set(
                headerName,
                value,
            );
        }
    }
}

async function readJsonResponse<T>(
    response: Response,
): Promise<T | null> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}