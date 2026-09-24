import {
  NextRequest,
} from "next/server";

import {
  ADMIN_CSRF_COOKIE_NAME,
  ADMIN_SESSION_COOKIE_NAME,
} from "@/utils/auth/session";

interface RequestOptions {
  method?: string;

  json?: unknown;

  authenticated?: boolean;

  includeCsrf?: boolean;
}

export function createClientRequest(
  path: string,
  {
    method = "GET",
    json,
    authenticated = true,
    includeCsrf = true,
  }: RequestOptions = {},
) {
  const headers =
    new Headers();

  if (authenticated) {
    const cookies = [
      `${ADMIN_SESSION_COOKIE_NAME}=django-session`,
    ];

    if (includeCsrf) {
      cookies.push(
        `${ADMIN_CSRF_COOKIE_NAME}=stored-csrf`,
      );
    }

    headers.set(
      "Cookie",
      cookies.join("; "),
    );
  }

  let body:
    BodyInit | undefined;

  if (json !== undefined) {
    headers.set(
      "Content-Type",
      "application/json",
    );

    body =
      JSON.stringify(
        json,
      );
  }

  return new NextRequest(
    `http://localhost:3000${path}`,
    {
      method,
      headers,
      body,
    },
  );
}