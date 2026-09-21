# Security

> Status: Mandatory
> Last reviewed: 2026-09-01

The backend is the security boundary. Everything here is defence in depth and
user experience — never the control itself.

## The Two Absolutes

1. **No secret ever reaches client code.** Anything the browser downloads is
   public, whatever it is named.
2. **The backend's address is never exposed.** The browser calls this portal;
   this portal calls the backend from the server. See `api-integration.md`.

## Environment Variables

- Only `NEXT_PUBLIC_`-prefixed variables reach the browser, and they may hold
  nothing sensitive — no API key, no backend URL, no internal hostname.
- `BACKEND_API_URL` and every credential are server-only, read in
  `endpoints/client.ts` and nowhere else.
- Every file that reads a server-only variable imports `server-only`, so a
  mistaken client import fails the build instead of shipping.

See `environment.md`.

## Tokens And Sessions

- Access and refresh tokens are stored in `httpOnly`, `Secure`,
  `SameSite=Strict` cookies set by a route handler.
- **Never** `localStorage`, `sessionStorage`, or a non-`httpOnly` cookie. Any of
  those hands the session to the first successful cross-site script.
- A token is never placed in a response body, a URL, a query string, a log line,
  or a client component's props.
- Sign-out clears the cookies and calls the backend so the session is revoked
  server-side, not merely forgotten locally.

## Authorization

- The portal hides what the signed-in level cannot use. Hiding is presentation.
- The backend refuses the action. That is the control.
- Never treat a hidden button, a disabled input, or a client-side role check as
  a security boundary.
- A 403 from the backend renders the 403 page. See `error-pages.md`.

## Input And Output

- Client-side validation mirrors the backend's rules for fast feedback and never
  replaces them. Every submission is validated again by the backend.
- Never render untrusted content with `dangerouslySetInnerHTML`. If a case ever
  genuinely requires it, sanitise first and record the reason in a comment.
- Never build a URL for redirect from user input without checking it is a path
  within this portal — an open redirect turns a phishing link into a trusted
  one.
- File uploads check type and size in the browser for feedback, and are checked
  again by the backend.

## Headers

Set in `next.config.ts` for every response:

- `Content-Security-Policy` — no `unsafe-eval`; `unsafe-inline` only if a
  framework requirement forces it, with the reason recorded.
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` — the portal is never framed.
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denying camera, microphone, and geolocation.

## Logging

Never log a password, a token, a reset link, a request body, or a full customer
record — not to the browser console, not to the server log. Log the correlation
ID and the route.

Remove every `console.log` before handover. A debug line that prints a session
object is a disclosure that ships.

## Dependencies

- Every dependency is pinned and justified: what it does, why it is not written
  in-house, and what it pulls in.
- No dependency that would put a secret in client code.
- A known-vulnerable package is not shipped.

## Device Headers

The portal forwards the browser's device headers to the backend so the audit
trail records the real device rather than this server. Dropping them would make
every staff action look as though it came from the portal host, which defeats
the platform's device tracking.

## Checklist

- [ ] No secret or backend URL in any client bundle.
- [ ] Tokens only in `httpOnly` cookies.
- [ ] Every server-only module imports `server-only`.
- [ ] Security headers configured.
- [ ] No `dangerouslySetInnerHTML` without sanitisation and a comment.
- [ ] No `console.log` left behind.
- [ ] Device headers forwarded on every backend call.
