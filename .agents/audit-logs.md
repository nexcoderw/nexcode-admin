# Audit Logs Screen

> Status: Current
> Scope: `app/admin` — `/audit-logs`
> Last reviewed: 2026-09-10

## What It Is

Every recorded action with the device that performed it, filterable and
searchable, plus the two moderation actions a reviewer can take on somebody they
find here.

| | |
| --- | --- |
| Route | `/audit-logs` |
| Backend | `GET /admin/audit-logs`, `GET /admin/audit-logs/actions` |
| Moderation | `POST /api/admin/accounts/:id/{block,unblock,flag,unflag}` |
| Sidebar | **Governance → Audit Logs** |

A **server component**. Filters arrive as search parameters, the backend is
called with the session cookie, and only the filter bar, table, and pager cross
into the browser — so the audit data never enters the client bundle and the
backend's address never appears in the network tab.

## Filters

The bar is the shared `FilterBar` — see "The Filter Bar" in `design.md` for its
layout and the rule about what earns a place on it. This screen supplies:

| Where | Filter |
| --- | --- |
| Bar | Search (name or email), From, To |
| Dialog | Action, Outcome, Role, Order by |

Fields are declared in `constants/audit/filters.ts`, not in the page, so the
screen stays a data-fetching component.

The **action menu is built from what the table actually contains**, with counts
beside each key. A menu of every key the code *can* write would offer filters
that return nothing.

**Ordering is one field, not two.** The backend takes `sortBy` and
`sortDirection` separately, but "newest first" is a single decision to the person
making it, so the menu keeps it as one `order=field:direction` value and the page
splits it apart. An unrecognised value falls back to newest-first rather than
being forwarded — the backend would refuse it, and a mistyped URL should show the
list, not an error.

## Keys Are Shown As Words

`admin.audit.read` is precise, stable, and meaningless to read. It is right in
the database — a key that never changes is what keeps a ten-year-old record
legible to a query — and wrong in a table somebody is scanning.

`constants/audit/labels.ts` maps every action, reason, resource, role, and
device family to the words staff use. `admin.audit.read` reads as **Audit trail
viewed**, `auth.reason.wrong_password` as **Wrong password**,
`CUSTOMER_REP` as **Customer representative**.

**The raw key is never thrown away.** It sits under the label in the table, in
mono and deliberately quiet, and again in the expanded detail as "Action key".
An investigator comparing a record to a log line needs the exact string to
search for, and a friendly name cannot be pasted into a query.

An unmapped key falls back to a humanised form of its last segment, so a new
action ships reading as "Account merge" rather than as a blank cell. A missing
label degrades the wording, never the record.

The action filter menu shows the same names, with the key as each option's
second line and the record count on the right, sorted by the name shown — a list
sorted by a string the reader cannot see looks unsorted.

## The Table

Each row is a summary; expanding one reveals device, IP, fingerprint,
correlation id, resource, action key, user agent, and the stored change summary
as JSON. An audit row carries far more than fits on a line, and a table that
shows everything at once cannot be scanned — which is the first thing a reviewer
needs to do.

**The expander is the first column**, ahead of the timestamp. It is the control
most used on this table, and a column of chevrons down the left edge is
scannable in a way one buried on the right is not. Moderation stays on the
right, where a destructive action is not the first thing under the cursor.

The detail **animates open and closed**. It is a grid whose single row moves
between `0fr` and `1fr`, which gives a real height animation with no hard-coded
maximum — `max-height` needs a number larger than the tallest possible detail,
which makes short rows animate slowly and tall ones clip.

Closing needs the row to stay mounted until the animation finishes, so the
component tracks a `closing` row alongside the open one and clears it on
`animationend`. Under `prefers-reduced-motion` the animation is shortened to
1ms rather than removed — `animation: none` would stop that event firing, and
the detail would collapse and then never unmount.

- The table scrolls inside its own box. The page never scrolls sideways.
- Outcome is the only colour on a row, because it is the column being scanned.
  It carries an **icon and a word as well as a colour**, so it reads correctly
  without colour vision.
- Anonymous rows say "Anonymous". That is not a gap in the record —
  pre-authentication attempts genuinely have no actor, and saying so is the
  point.
- The change summary is shown as stored. A reviewer comparing it to a bug report
  needs the exact document, not a prettified interpretation.
- The actor's name links to that account's own history.

Paging uses the shared `Pagination` — numbered, with both ends always reachable
and the current page as a solid brand pill. An audit trail is evidence, and a
page number is a statement somebody can check; an endless list that silently
stops loading is not. See "Pagination" in `design.md`.

## Blocking And Flagging

Two icon buttons per row, and both open a dialog that **restates who the account
is** before confirming. The row that was clicked is behind a scrim, and
confirming a suspension against a half-remembered name is how the wrong account
gets blocked.

| | Effect |
| --- | --- |
| Flag | Marked for review. Nothing changes about what the account may do, nobody is signed out |
| Block | Sign-in refused, every session ends immediately. Nothing is deleted, and it can be undone |

Block uses the **danger** button variant and says plainly that sessions end.
Flag does not. A reviewer about to cut somebody off should be told that is what
they are doing.

A reason is required — the button stays disabled below four characters. That
mirrors the backend, which validates it again; the client check exists to
explain, not to enforce.

**Moderation buttons do not render for your own account.** The backend refuses
it with 403, and offering a control that always fails is worse than not offering
it.

On success the dialog closes, a toast reports the outcome in the portal's own
words, and `router.refresh()` re-reads the blocked and flagged badges the server
rendered before the change.

## States

| State | What shows |
| --- | --- |
| Records found | Table, filter bar, pager |
| No match | An empty state naming the filters as the cause, not an error |
| Scoped to one actor | A banner saying so, with "Show everyone" |
| Backend unreachable | Inline alert; the heading and navigation still work |

The load failure is inline rather than an error page: only the table is missing,
and throwing away the whole screen would be a bigger loss than the one it is
reporting. The action menu failing is not an error at all — the screen renders
with an empty menu, because losing a convenience is not worth a failure page.

## Verified

Against the running stack, signed in through the portal:

| Check | Result |
| --- | --- |
| `/audit-logs` and every filtered variant | 200 |
| Page size | 50 rows, capped by the backend |
| `outcome=FAILURE` | 62 of 140 records, only Failure rows rendered |
| Pagination | Page 1 of 3 and Page 2 of 3 return different slices |
| No match | Empty state, zero rows |
| Scoped view | Banner and "Show everyone" present |
| Sidebar and top bar | "Audit Logs", labelled **Governance / Audit Logs** |
| Filter bar | Search, From, To, Filters, Clear all render on the bar |
| Active-filter badge | Shows **2** with two filters set, absent with none |
| `order=occurredAt:asc` | Returns the oldest records, not the newest |
| `order=bogus:xx` | Falls back to newest-first, no error page |
| Backend URL in HTML | Absent |

**Not yet exercised:** a successful block or flag. The platform currently has
one account — the signed-in administrator — and self-moderation is correctly
hidden in the UI and refused by the backend. The refusal paths were verified
directly (403 self, 404 unknown, 400 empty reason, 401 unauthenticated).
