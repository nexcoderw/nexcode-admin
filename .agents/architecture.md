# Architecture

> Status: Mandatory
> Last reviewed: 2026-09-01

## Position In The Platform

```text
browser  ──▶  app/admin (this portal)  ──▶  api/api  ──▶  api/db  ──▶  MySQL
```

The browser talks only to this portal. This portal talks only to the backend.
Nothing here reaches the database, and nothing here decides what a role is
allowed to do — it renders what the backend permits. See `api-integration.md`.

## Rendering Model

Next.js App Router, React 19, with the React Compiler enabled.

- **Server components are the default.** They fetch data, hold no state, and
  ship no JavaScript to the browser.
- **Client components are the exception**, marked `'use client'` only where
  state, effects, or browser APIs are genuinely needed — forms, tables with
  interactive filters, modals.
- The `'use client'` boundary is pushed as deep as possible. Marking a page as a
  client component sends the whole page to the browser and gives up the reason
  we chose this framework.
- Layouts are never client components.

## Route Groups

```text
app/
  (auth)/          # unauthenticated: login, reset password — no sidebar
  (dashboard)/     # authenticated: shares the sidebar and header layout
  api/             # route handlers the browser calls
```

Route groups keep the two layouts apart without adding a path segment. Anything
under `(dashboard)` requires a session; anything under `(auth)` must not.

## Session Handling

- The access token and refresh token live in `httpOnly`, `Secure`,
  `SameSite=Strict` cookies set by a route handler. Client JavaScript can never
  read them, so a cross-site script cannot steal them.
- Middleware checks for a session on `(dashboard)` routes and redirects to login
  when it is absent, preserving the intended path.
- That check is convenience, not security. Every backend call is authorised by
  the backend on its own.
- A refresh happens server-side. When it fails, the session is cleared and the
  user returns to login.
- `mustChangePassword` on the sign-in response forces the password change screen
  before anything else is reachable.

## Data Flow

| Need | How |
| --- | --- |
| Page data | Server component calls an endpoint function directly |
| Form submission | Browser posts to a route handler under `app/api/` |
| Mutation from a client component | Route handler, then refresh the affected server data |
| Shared client state | React context in a provider under the closest layout |

There is no global client store. A portal of tables and forms does not need
one, and adding it would move state that belongs on the server into the browser.

## Layer Responsibilities

| Layer | Owns | Must never |
| --- | --- | --- |
| `app/**/page.tsx` | Composing a screen from components | Contain business logic, styling rules, or fetch details |
| `app/api/**/route.ts` | Translating a browser request into a backend call | Contain business rules or expose the backend |
| `endpoints/**` | Knowing the backend's shape | Be imported by client code |
| `components/**` | Presentation and interaction | Fetch data or know the backend exists |
| `hooks/**` | Client state and effects | Contain markup |
| `utils/**` | Pure transformation | Hold state or perform I/O |
| `constants/**` | Fixed values and paths | Contain logic |

Components receive data as props. A component that fetches its own data cannot
be reused, cannot be tested, and usually causes a waterfall.

## Boundaries Between Features

Features — bookings, customers, staff, dashboard — each own a folder in
`components/`, `hooks/`, `utils/`, and `constants/`. A feature never imports
another feature's internals. When two need the same thing, it moves to
`shared/`. See `folder-structure.md`.

## Relationship To The Backend

The backend is the authority on business rules, authorization, and message
wording. This portal:

- Mirrors validation rules for immediate feedback, and always submits anyway,
  because the backend's answer is the real one.
- Renders the backend's `message` and keys behaviour off its `messageKey`.
- Never invents a rule the backend does not enforce.

When a screen needs something the backend does not expose, the endpoint is added
to `api/api` first. Never work around a missing endpoint by fetching more data
and filtering it in the browser.
