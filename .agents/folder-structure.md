# Folder And File Structure

> Status: Mandatory
> Last reviewed: 2026-09-01

Structure is a portal goal, not a preference. A crowded file is treated as a
defect in the same way a failing build is.

## The Layout

```text
src/
  app/                      # routes only — App Router pages and route handlers
    layout.tsx
    globals.css
    page.tsx
    (auth)/
      login/
        page.tsx
        page.module.css
      reset-password/
    (dashboard)/
      layout.tsx
      dashboard/
      bookings/
      customers/
      staff/
    api/                    # route handlers that proxy to the backend
      auth/
        login/route.ts
        password-reset/
          request/route.ts
          confirm/route.ts
    not-found.tsx
    forbidden.tsx
    error.tsx
    global-error.tsx
  components/
    shared/                 # used by three or more features
      Button.tsx
      Button.module.css
      Input.tsx
      Select.tsx
      Modal.tsx
      Table.tsx
    layout/                 # chrome: Navbar, Sidebar, Footer, PageHeader
    dashboard/              # components for the dashboard pages only
    bookings/
    customers/
    staff/
    auth/
  endpoints/                # backend endpoint definitions, one per file
    auth/
      login.ts
      request-password-reset.ts
      confirm-password-reset.ts
    client.ts
  constants/
    routes/                 # one file per domain: page and API routes
      auth-routes.ts
      portfolio-routes.ts
    messages/               # one file per domain: message keys and text
      auth-messages.ts
      messages.ts           # registry resolving any key to its text
    shared/                 # constants used across features
    dashboard/              # constants for one feature
  hooks/
    shared/
    dashboard/
  utils/
    shared/
    dashboard/
  types/
    shared/
    dashboard/
  styles/
    tokens.css              # design tokens, imported by globals.css
```

Every one of `components/`, `constants/`, `hooks/`, `utils/`, and `types/`
follows the same shape: a `shared/` folder for what several features need, and
one folder per feature for what only that feature needs.

## Naming

| Kind | Convention | Example |
| --- | --- | --- |
| Component file | `PascalCase.tsx` | `BookingTable.tsx` |
| Component styles | `PascalCase.module.css` beside it | `BookingTable.module.css` |
| Page | `page.tsx` with `page.module.css` beside it | |
| Hook | `useCamelCase.ts` | `useBookingFilters.ts` |
| Utility | `kebab-case.ts` | `format-currency.ts` |
| Constants | `kebab-case.ts` | `booking-statuses.ts` |
| Endpoint | `kebab-case.ts`, one endpoint per file | `confirm-password-reset.ts` |
| Types | `kebab-case.ts` | `booking.ts` |
| Folders | lowercase `kebab-case` | `password-reset/` |

## One Concern Per File

- One exported component per file. A file exporting a table *and* its row *and*
  its empty state is three files.
- One endpoint per file in `endpoints/`. `login.ts` holds login and nothing
  else.
- A component's styles live in its own `.module.css` beside it. Never a shared
  stylesheet for several components.

## Size Limits

| Limit | Rule |
| --- | --- |
| 150 lines | Soft ceiling for a component. Above this, justify it. |
| 250 lines | Hard ceiling for any file. Split before handover. |
| 50 lines | Hard ceiling for a function or a hook. |
| 3 | Maximum nesting depth of JSX conditionals. Deeper means extract. |
| 5 | Maximum props before the component is doing too much. |

Documentation comments do not count toward these limits.

## How To Split A Crowded Component

Split by responsibility, never at an arbitrary line count:

1. Repeated markup → a child component in the same feature folder.
2. State and effects → a hook in `hooks/<feature>/`.
3. Pure transformation or formatting → a function in `utils/<feature>/`.
4. Fixed lists, labels, option sets → `constants/<feature>/`.
5. Data fetching → an endpoint in `endpoints/` called from a server component.

Splitting must not create pass-through files that only re-export. A new file
earns its place by owning a real responsibility.

## Placement Rules — Preventing Duplication

Apply in order:

1. Used **once**, inside one component → keep it in that file.
2. Used by **two or more files in one feature** → move it to that feature's
   folder (`components/bookings/`, `utils/bookings/`).
3. Used by **three or more features** → and only then — move it to `shared/`.

Never put something in `shared/` because it might be reused later. It moves
there when the third real consumer exists, not before.

**What belongs in `components/shared/`:** `Button`, `Input`, `Select`,
`Checkbox`, `Modal`, `Table`, `Pagination`, `Badge`, `Spinner`, `EmptyState`,
`Toast` — pieces with no knowledge of any feature.

**What never belongs there:** anything that names a domain concept, and anything
that needs a `variant="bookings"` prop to serve its callers. A shared component
that branches on which feature is using it was never shared — split it back.

## Server And Client Components

- Server components are the default. Add `'use client'` only when the file
  actually needs state, effects, or browser APIs.
- Push `'use client'` as far down the tree as possible. A client boundary at the
  page level ships the whole page to the browser.
- Never mark a layout as a client component.

## Import Rules

- Use the `@/` alias. No relative path climbing more than one level.
- No circular imports. If two files need each other, a third owns the shared
  piece.
- A feature folder never imports another feature's internals. If two features
  need the same thing, it moves to `shared/`.
- `components/` never imports from `app/`.

## Checklist Before Handover

- [ ] No file over 250 lines; every component over 150 is justified.
- [ ] Every component has its own `.module.css` beside it.
- [ ] Every new `shared/` item has at least three real consumers.
- [ ] No copy-pasted block exists in two places.
- [ ] No feature imports another feature's internals.
- [ ] `'use client'` appears only where state or browser APIs are used.
