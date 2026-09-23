# Error And Status Pages

> Status: Mandatory
> Last reviewed: 2026-09-01

Every way this portal can fail has a designed page. A user must never see a raw
stack trace, a blank screen, or a browser default.

## The Screens

| Screen | Reached by | Says |
| --- | --- | --- |
| `app/not-found.tsx` | Any unmatched route, or `notFound()` | 404 — the address is valid, nothing lives at it |
| `app/(errors)/unauthorized` | Redirect, when a session has ended | 401 — we could not confirm who you are |
| `app/(errors)/forbidden` | Redirect, when access is refused | 403 — we know you, and this is not open to you |
| `app/(errors)/service-unavailable` | Redirect, when the backend cannot be reached | 503 — the portal is up, the service behind it is not |
| `app/error.tsx` | Any component that throws | 500 — something went wrong |
| `app/global-error.tsx` | A failure in the root layout | The portal could not start |

**401, 403 and 503 are routes, not file conventions.** Next has `forbidden.tsx`
and `unauthorized.tsx` conventions, but they need `experimental.authInterrupts`,
which is canary-only — not a flag to turn on in a portal that handles staff
credentials. Real addresses also mean a reader can send a colleague the page
they are stuck on.

### They Are One Component

All six render `ErrorScreen`, so five failures look like one product rather than
five accidents. What differs is the number, the words, and the drawing.

Each drawing is its own shape, because the shape is what a reader recognises
before they read anything — one illustration reused above a different number
tells them nothing:

| | The drawing |
| --- | --- |
| 404 | A map pin over a sweeping search ring |
| 401 | A key that approaches a lock and is turned away |
| 403 | A shield with the bar drawn across it as the screen appears |
| 500 | A panel with a break in it, and a spark that keeps trying to cross |
| 503 | A server sending waves out with nothing coming back |

They are inline SVG on design tokens — flat, solid brand colour, **no
gradients**, in syntax or in appearance. Depth is the ground ellipse and the
difference between fills.

Every animation is decoration: the screen states the problem in words beside it,
so `prefers-reduced-motion` stops all of it and costs the reader nothing. The
one exception is the 403 bar, which is held at its finished position rather than
removed — it is part of the drawing, not part of the motion.

`global-error.tsx` imports **nothing** — no tokens, no fonts, no shared
components, and its mark is drawn inline rather than fetched. Everything it
might import is part of what has just failed, and a fallback that depends on the
thing it is falling back from is not a fallback.

## What Every Error Page Shows

1. **What happened**, in plain English. Not "Error 500".
2. **What to do next** — retry, go back to the dashboard, or contact support.
3. **The correlation ID**, when the failure came from the backend. It is the
   reference that ties a user's report to the audit trail and the server log.
4. **Nothing technical.** No stack trace, no backend URL, no upstream status,
   no exception message.

## Status Meanings

| Status | Cause | Portal behaviour |
| --- | --- | --- |
| 401 | No session, or it expired | Redirect to login, keeping the intended path to return to |
| 403 | Signed in, insufficient authority | Show the 403 page. Never redirect to login — the user is already signed in, and bouncing them to a login form is a lie about what went wrong |
| 404 | Unknown route, or a record that is gone | Not found page |
| 409 | State conflict the backend refused | Handle in the form, with the backend's message |
| 429 | Rate limited | The backend's message, with a wait hint |
| 5xx | Backend fault or unreachable | Generic failure page with the correlation ID |

## The 403 Rule

`OWNER` and `STANDARD` administrators see different capabilities. The portal
hides what a `STANDARD` administrator cannot use — but hiding is presentation,
never enforcement. The backend refuses the action, and the portal renders 403
when it does.

Never assume the portal's own check is sufficient. Never treat a hidden button
as a security control.

## Client-Side Error Boundaries

`error.tsx` is a client component, and receives `error` and `reset`. Show the
message the portal decided on, and offer `reset()` as retry — never render
`error.message` directly, since it may carry internal detail from an exception
that was never meant for a user.

## Loading States

Page loading has one owner: `app/(dashboard)/loading.tsx`, which renders the
shared `PageLoader` for every dashboard route. It sits inside the admin shell,
so the header stays in place and only the content area waits, and it stays
hidden for the first moment so quick navigations never flash it.

Do not add per-route `loading.tsx` files or page skeletons; every page shares
the one loader. In-place feedback for an action — a button that is saving —
is a control state, not a page loader, and belongs to that control.

## Empty States

Not an error, but the same principle. Every list, table, and search result has a
designed empty state that says what is missing and what to do about it. "No
bookings yet — bookings appear here once customers start reserving" beats a
blank panel.

## Offline And Timeout

- A failed request because the browser is offline says so, and offers retry.
- A request that times out is reported as a timeout, not a generic failure —
  the two lead to different user actions.

## Checklist

- [ ] `not-found`, `error`, `global-error`, and the 401/403/503 routes exist and are
      styled.
- [ ] Nested `error.tsx` exists wherever a failure should stay contained.
- [ ] No error page shows a stack trace, backend URL, or raw exception message.
- [ ] Backend failures display the correlation ID.
- [ ] 403 shows the 403 page and never redirects to login.
- [ ] Page loading goes through the shared `PageLoader`; no per-route loaders.
- [ ] Every list has a designed empty state.
