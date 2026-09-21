# Environment And Configuration

> Status: Mandatory
> Last reviewed: 2026-09-01

## The Two Files

| File | Committed | Contains |
| --- | --- | --- |
| `.env.example` | Yes | The full structure: every variable name, a commented explanation, a safe placeholder, and generation instructions. No real values, ever. |
| `.env.local` | No | The real values used on this machine. Never committed, never pasted into chat, never logged. |

## The Order Of Operations

When a new configuration value is needed:

1. **Add the variable to `.env.example` first** — grouped with the variables
   that serve the same purpose, under a comment heading, with a placeholder and,
   if the value must be generated, the exact command.
2. Tell the user which variable to add to `.env.local` and how to produce it.
3. Add it to the typed configuration module so a missing value fails at startup.
4. Only then write code that reads it.

A variable that exists in code but not in `.env.example` is a defect.

## The `NEXT_PUBLIC_` Rule

This is the one that matters most in a frontend project.

- A `NEXT_PUBLIC_` variable is **compiled into the browser bundle**. Anyone can
  read it. It may hold nothing sensitive — no API key, no secret, no internal
  hostname, and **not the backend URL**.
- Everything else is server-only and readable only in server components, route
  handlers, and `endpoints/`.
- Every module reading a server-only variable imports `server-only`, so a
  mistaken client import fails the build rather than shipping the value.

Before adding a `NEXT_PUBLIC_` variable, ask whether you would publish its value
on the portal's login page. If not, it is not public.

## `.env.example` Format Rules

- Variables serving the same purpose are grouped under one `# ---` heading.
- Each variable has a comment above it explaining its purpose and what a valid
  value looks like.
- If the user must generate the value, the comment states the exact command.
- Placeholders are obviously fake: `change-me`, `generate-with-command-above`.
- Group order: application, backend connection, session, security, observability.

## Reading Configuration

- Server-only values are read in one place per concern —
  `endpoints/client.ts` for the backend address, the session module for cookie
  settings — never scattered through the codebase.
- Validate at startup. A missing required value stops the build or the boot with
  a message naming the variable; it never degrades to a default in production.
- Defaults are allowed only for non-sensitive, non-behavioural values such as a
  page size.

## Environment Separation

- Local development uses `.env.local`.
- Deployed environments receive values through the platform's secret store, not
  through committed files.
- A production value is never used locally, and a local value is never accepted
  by a deployed environment.
- Rotating a secret must not require a code change.
