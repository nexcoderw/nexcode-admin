# API Integration

> Status: Mandatory
> Last reviewed: 2026-09-01

## The Rule

**The browser never learns the backend's address.** Every request the browser
makes goes to this portal's own origin. The portal calls the backend from the
server, where the address, the port, and the credentials stay.

Open the network tab while using this portal and you must see only
`https://admin.nexcode.example/api/...`. Seeing `http://localhost:8000` or any
backend host is a defect, not a detail.

## Two Directories, Two Jobs

| Directory | Registers | Runs on |
| --- | --- | --- |
| `src/endpoints/` | The **backend's** endpoints — one file per endpoint, grouped by purpose | Server only |
| `src/app/api/` | The **portal's** endpoints — a `route.ts` per path the browser calls | Server (route handlers) |

The browser calls `src/app/api/**/route.ts`. That handler calls a function from
`src/endpoints/`. That function is the only code that knows the backend exists.

```
browser  ──▶  /api/auth/login          (app/api/auth/login/route.ts)
                     │
                     ▼
              login()                  (endpoints/auth/login.ts)
                     │
                     ▼
         http://backend:3000/api/v1/auth/admin/login
```

## `src/endpoints/` — One Endpoint Per File

Each backend endpoint gets its own file. Endpoints serving the same purpose sit
in the same folder:

```text
src/endpoints/
  client.ts                          # the shared server-side fetch wrapper
  auth/
    login.ts
    request-password-reset.ts
    confirm-password-reset.ts
  bookings/
    list-bookings.ts
    get-booking.ts
    confirm-booking.ts
  staff/
    list-staff.ts
    invite-staff.ts
```

Never group two endpoints into one file, and never a `bookings.ts` holding six
functions. One file, one endpoint, one exported function.

Each file declares its request type, its response type, and one function:

```ts
/**
 * Signs an administrator in.
 *
 * Server-only: this module reads the backend address, which must never reach
 * client code.
 */
import 'server-only';

import { backendRequest } from '@/endpoints/client';
import type { AdminSession } from '@/types/shared/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Calls the backend's administrator sign-in endpoint.
 *
 * @param body - Submitted credentials.
 * @param forwarded - Device headers forwarded from the browser's request.
 * @returns The backend's envelope, success or failure.
 */
export async function login(body: LoginRequest, forwarded: Headers) {
  return backendRequest<AdminSession>('/auth/admin/login', {
    method: 'POST',
    body,
    forwarded,
  });
}
```

Every file in `src/endpoints/` starts with `import 'server-only'`. That turns a
mistaken client import into a build error rather than a leaked address.

## `src/endpoints/client.ts` — The Shared Wrapper

One place owns: the backend base URL, timeouts, the device headers, the
correlation ID, and turning the backend's envelope into a typed result. It never
throws on a business failure — a 401 from the backend is data the portal renders,
not an exception.

It must:

- Read `BACKEND_API_URL` from the server environment only.
- Forward `X-Device-Id`, `X-Device-Type`, `X-Device-Platform`,
  `X-Device-Os-Version`, and `X-App-Version` from the browser's request, so the
  backend's audit trail records the real device rather than this server.
- Forward the client's IP through the proxy header the backend expects, for the
  same reason.
- Attach the access token from the session cookie for authenticated calls.
- Apply a timeout. A slow backend must not hold a portal request open forever.
- Return `{ ok, status, data, body }`, and log the reason a call failed —
  never to the browser, always to the server.

It must never log a request body, a token, or a password.

## `src/app/api/` — The Portal's Own Endpoints

One `route.ts` per path the browser calls, mirroring the folder shape of the
paths themselves:

```text
src/app/api/
  auth/
    login/route.ts               ->  POST /api/auth/login
    logout/route.ts              ->  POST /api/auth/logout
    password-reset/
      request/route.ts           ->  POST /api/auth/password-reset/request
      confirm/route.ts           ->  POST /api/auth/password-reset/confirm
  bookings/
    route.ts                     ->  GET  /api/bookings
    [id]/route.ts                ->  GET  /api/bookings/:id
```

A route handler is thin. It reads the request, calls one endpoint function,
translates the result into a response, and — where a session is involved — sets
or clears the cookie:

```ts
export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequest;
  const result = await login(body, new Headers(request.headers));

  if (!result.ok) {
    // Narrowed to the stable key and the field messages. The backend's own
    // wording and correlation reference stay on this side of the boundary.
    return NextResponse.json(toClientFailure(result.body), { status: result.status });
  }

  const response = NextResponse.json({ mustChangePassword: ... });

  setSessionCookies(response, result.data);

  return response;
}
```

Rules for handlers:

- Never return the raw backend response object; return only what the browser
  needs.
- **Never put the refresh token in a response body.** It goes into an
  `httpOnly`, `Secure`, `SameSite=Strict` cookie the browser cannot read.
- Never include the backend's URL, host, or upstream status detail in an error.
- Narrow every failure through `toClientFailure`. The backend's `message`,
  `correlationId`, and `language` never cross to the browser.

## Server Components Skip The Hop

A server component renders on the server already, so it calls the endpoint
function directly:

```tsx
const bookings = await listBookings(searchParams, await headers());
```

`src/app/api/` exists for what the **browser** initiates: form submissions,
mutations, and client-side refreshes. Do not add a route handler for data a
server component can fetch itself — that is a wasted network hop.

## Route Registry

Paths are never written as string literals. `src/constants/routes.ts` holds
both:

```ts
export const PAGE_ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  bookings: '/bookings',
  booking: (id: string) => `/bookings/${id}`,
} as const;

export const API_ROUTES = {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  requestPasswordReset: '/api/auth/password-reset/request',
  confirmPasswordReset: '/api/auth/password-reset/confirm',
} as const;
```

A typo in a hard-coded path is a runtime 404; a typo here is a compile error.

## Adding A New Backend Endpoint

In order:

1. Read the backend's feature document in `api/api/docs/` for the exact path,
   body, statuses, and message keys.
2. Add the types to `src/types/`.
3. Add one file to `src/endpoints/<purpose>/`.
4. If the browser calls it, add one `route.ts` under `src/app/api/` and register
   it in `constants/routes.ts`. If only a server component needs it, stop here.
5. Handle every documented error status the backend can return, not just the
   happy path.

## Error Handling

**The backend's wording never reaches the browser.** Its envelope is written for
API consumers and carries a correlation reference that means nothing to a member
of staff — and reads badly when absent, as "Reference: unavailable".

Every route handler narrows a failure through `toClientFailure`, which keeps
only:

| Field | Why it survives |
| --- | --- |
| `messageKey` | Stable; the portal maps it to its own copy |
| `fields` | Already plain sentences, rendered under their inputs |

Everything else — `message`, `correlationId`, `language` — stays on the server,
where it is logged. A failure the browser receives looks like this and nothing
more:

```json
{ "success": false, "messageKey": "auth.error.invalid_credentials" }
```

The portal's copy lives in `constants/shared/messages.ts`, keyed by
`messageKey`, with a generic fallback for any key it does not know. That is what
guarantees a user only ever reads text this project wrote.

## Showing Outcomes

| What | Where |
| --- | --- |
| Form-level outcome — refused sign-in, saved profile | **Toast**, via `useApiForm` |
| Field-level validation | **Under the field**, via the control's `error` prop |
| Screen state — "check your inbox", "link incomplete" | Inline `Alert` on the screen |

`useApiForm` raises the toasts itself, so no form carries its own message state
and every form behaves identically. A form that navigates on success passes no
`successKey`: a toast the user never gets to read is noise.

## Checklist

- [ ] The browser's network tab shows only this portal's origin.
- [ ] Every file in `endpoints/` imports `server-only` and holds one endpoint.
- [ ] No route handler leaks a backend URL, host, or upstream detail.
- [ ] Tokens are in `httpOnly` cookies, never in a response body or
      `localStorage`.
- [ ] Device headers are forwarded so the backend audits the real device.
- [ ] Every documented error status is handled.
- [ ] No hard-coded path outside `constants/routes.ts`.
