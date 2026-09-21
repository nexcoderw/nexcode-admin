# NEXCODE Admin — Agent Instructions

This file is the primary instruction router for AI agents and contributors working on the NEXCODE Admin application.

Detailed rules live in:

```text
.agents/
```

Do not treat those files as independent suggestions.

They form one coordinated rule system.

Before modifying the project, determine which rules apply to the task and follow all applicable files together.

---

## 1. Project Context

NEXCODE Admin is the administrative frontend for the NEXCODE platform.

The application is built with:

* Next.js
* React
* TypeScript
* CSS Modules

The Django application is the backend and authorization boundary.

The Next.js application acts as the administrative web interface and server-side intermediary between the browser and backend services.

The browser must not communicate directly with the Django backend.

---

## 2. Core Engineering Principles

All work should preserve the following principles:

1. Security boundaries must remain explicit.
2. Server Components are preferred by default.
3. Client Components are introduced only when client-side behaviour requires them.
4. Backend communication is server-side.
5. Browser requests use the Next.js application's own `/api/...` routes when browser-initiated requests are necessary.
6. CSS Modules are the default and required component styling architecture.
7. Tailwind CSS is not used.
8. Shared visual decisions come from design tokens.
9. Components and pages own their styles.
10. Accessibility is part of implementation quality.
11. Performance should be considered during implementation rather than after it.
12. Existing project architecture should be extended rather than bypassed.
13. Sensitive backend or infrastructure details must never leak to the browser.
14. Changes should remain focused on the requested task.

---

# Rule System

## 3. Rule Directory

Detailed project rules are located in:

```text
.agents/
├── architecture.md
├── api-integration.md
├── audit-logs.md
├── design.md
├── environment.md
├── error-pages.md
├── folder-structure.md
├── git.md
├── performance.md
├── security.md
└── styling.md
```

Each file owns a specific concern.

Agents must read the relevant rules before implementing work in that area.

---

## 4. Rule Responsibilities

### `architecture.md`

Defines application architecture and architectural boundaries.

Read when working on:

* Pages
* Layouts
* Components
* Server Components
* Client Components
* Route handlers
* Application structure
* Data flow
* Feature architecture
* Shared application infrastructure

This rule should normally be considered for any substantial implementation task.

---

### `api-integration.md`

Defines how the Next.js application communicates with the backend.

Read when working on:

* Backend requests
* `src/endpoints/`
* `src/app/api/`
* Route handlers
* Authentication requests
* Request/response transformation
* API errors
* Cookies
* Refresh-token behaviour
* Device headers
* Backend route definitions

The browser must never be given the backend address.

Server Components should call server-only endpoint functions directly where appropriate.

Browser-initiated backend operations must pass through the Next.js application's own API routes.

---

### `audit-logs.md`

Defines feature-specific requirements for the audit-log system.

Read when working on:

```text
/audit-logs
```

or components and API behaviour specifically supporting that feature.

This rule supplements the general architecture, API, security, design, styling, and performance rules.

It does not replace them.

---

### `design.md`

Defines what the NEXCODE Admin interface should look and feel like.

Read for every user-facing interface task.

It defines:

* Brand identity
* Colour direction
* Typography
* Surface hierarchy
* Layout principles
* Spacing philosophy
* Buttons
* Forms
* Tables
* Navigation
* Status indicators
* Loading states
* Empty states
* Responsive design
* Motion
* Accessibility
* Interaction principles

The NEXCODE primary colour is:

```text
#D0FF71
```

The primary functional typeface is:

```text
Outfit
```

`Six Caps` and `Sacramento` are restricted brand/display typefaces.

`Prompt` belongs to the legacy Django/Jazzmin admin and must not become the default font of the Next.js admin.

---

### `styling.md`

Defines how the design system is implemented technically.

Read whenever creating or changing:

* CSS
* CSS Modules
* Layout styling
* Component styling
* Responsive styling
* Typography implementation
* Design-token usage
* Interaction states
* Animation
* Visual component states

The required styling architecture is:

```text
Design tokens
      ↓
CSS Modules
      ↓
Page/component styles
```

Tailwind CSS must not be used.

CSS-in-JS must not be introduced as the project's styling architecture.

Static component styling belongs in `.module.css` files.

---

### `folder-structure.md`

Defines where files belong and how project directories should be organised.

Read when:

* Creating files
* Creating components
* Creating features
* Adding routes
* Adding endpoint files
* Adding shared utilities
* Moving files
* Refactoring project structure

Do not invent a new directory structure without checking this rule.

---

### `security.md`

Defines security requirements.

Read whenever work involves:

* Authentication
* Authorization
* Cookies
* Tokens
* API communication
* User-controlled content
* Sensitive information
* Headers
* Environment variables
* Backend errors
* Redirects
* HTML rendering
* Logging
* Protected routes

Security requirements take precedence over convenience.

The backend remains the authorization boundary.

Never expose secrets, tokens, internal backend addresses, stack traces, or sensitive implementation details to the browser.

---

### `performance.md`

Defines performance requirements and rendering expectations.

Read when working on:

* React components
* Server/Client Component boundaries
* Data fetching
* Large lists
* Tables
* Images
* Fonts
* Dynamic imports
* Expensive UI
* Animation
* Loading behaviour

Server Components are the default.

Use `'use client'` only as deep in the component tree as necessary.

Do not turn an entire page into a Client Component simply because one child requires interactivity.

---

### `environment.md`

Defines environment-variable and configuration rules.

Read when:

* Adding environment variables
* Changing backend configuration
* Adding service URLs
* Adding environment-dependent behaviour
* Updating `.env.example`
* Creating server configuration

Backend URLs and secrets must never use `NEXT_PUBLIC_*`.

Only values intentionally safe for browser exposure may use the `NEXT_PUBLIC_*` prefix.

---

### `error-pages.md`

Defines application error and status-page behaviour.

Read when working on:

* 404
* 401
* 403
* 500
* 503
* `not-found`
* `error`
* `global-error`
* Shared error screens
* Error-state UI
* Loading states associated with error boundaries

Error pages must follow the NEXCODE design system and must not expose technical backend details.

---

### `git.md`

Defines repository and Git workflow rules.

Read before preparing a handover involving changed files.

AI agents must not execute repository-mutating Git operations prohibited by this rule.

In particular, do not automatically perform:

```text
git add
git commit
git push
git merge
git rebase
git reset
git revert
git clean
```

Do not create branches, tags, or releases unless the rule is explicitly changed.

Inspection commands such as these may be used when needed:

```text
git status
git diff
git log
```

When handing work back to the developer, provide the required Git commands rather than executing prohibited operations.

Follow the one-file-per-commit requirements defined in `git.md`.

Never use:

```text
git add .
git add -A
git add -u
```

for project handover instructions.

---

# Rule Coordination

## 5. Rules Are Cumulative

A task may require several rule files.

Do not select one rule and ignore the others.

For example, creating a new administrative page is not merely a styling task.

It may require:

```text
architecture.md
folder-structure.md
design.md
styling.md
performance.md
```

If the page retrieves protected backend data, it additionally requires:

```text
api-integration.md
security.md
```

If environment configuration changes:

```text
environment.md
```

also applies.

---

## 6. Rule Precedence

When multiple rules apply, use the following general priority:

```text
1. Security
2. Architecture and API boundaries
3. Feature-specific requirements
4. Design system
5. Styling implementation
6. Folder structure
7. Performance
8. Environment/configuration requirements
9. Git and handover workflow
```

This ordering is intended to resolve implementation tension, not to make lower rules optional.

All applicable rules should still be satisfied.

---

## 7. Security Overrides Convenience

If a proposed implementation is visually simpler or technically easier but violates `security.md`, it must not be used.

For example:

```text
Browser → Django backend
```

may appear simpler than:

```text
Browser
   ↓
Next.js /api
   ↓
server-only endpoint
   ↓
Django backend
```

but the direct-browser architecture violates the project's backend-isolation requirement.

Use the secure architecture.

---

## 8. Architecture Overrides Local Convenience

Do not bypass established application layers because a feature appears small.

Examples:

Do not fetch the Django backend directly from a Client Component.

Do not place reusable backend logic inside a React component.

Do not expose server configuration so the browser can make a request itself.

Do not duplicate endpoint definitions across components.

Follow the established architecture.

---

## 9. Feature Rules Extend General Rules

Feature-specific rules supplement the global system.

For example:

```text
audit-logs.md
```

may specify the structure of an audit table, filters, moderation controls, and pagination.

The implementation must still follow:

```text
architecture.md
api-integration.md
design.md
styling.md
security.md
performance.md
```

where applicable.

---

# Task Rule Matrix

## 10. UI Component

When creating or modifying a normal UI component, read:

```text
design.md
styling.md
folder-structure.md
performance.md
```

Also read `architecture.md` when the component affects application structure or rendering boundaries.

---

## 11. Page

When creating or modifying a page, read:

```text
architecture.md
design.md
styling.md
folder-structure.md
performance.md
```

If backend data is involved, also read:

```text
api-integration.md
security.md
```

---

## 12. API Feature

When implementing backend communication, read:

```text
architecture.md
api-integration.md
security.md
```

Also read:

```text
environment.md
```

when configuration or service URLs are involved.

---

## 13. Authentication

Authentication-related work requires:

```text
architecture.md
api-integration.md
security.md
environment.md
error-pages.md
```

If UI is involved, also apply:

```text
design.md
styling.md
```

---

## 14. Audit Logs

Audit-log work requires:

```text
audit-logs.md
architecture.md
api-integration.md
design.md
styling.md
security.md
performance.md
folder-structure.md
```

Use `environment.md` if configuration changes.

---

## 15. Error and Status Pages

Error-page work requires:

```text
error-pages.md
design.md
styling.md
performance.md
```

Apply `security.md` whenever error information originates from protected or backend systems.

---

## 16. Environment Configuration

Environment work requires:

```text
environment.md
security.md
```

If configuration affects API communication, also apply:

```text
api-integration.md
```

---

## 17. Styling Work

Pure styling work requires:

```text
design.md
styling.md
```

If styling affects performance, responsive behaviour, animation, or rendering strategy, also apply:

```text
performance.md
```

---

## 18. File or Folder Changes

Any task creating, moving, or reorganising files requires:

```text
folder-structure.md
```

Architectural changes also require:

```text
architecture.md
```

---

## 19. Git Handover

Before giving the developer Git commands, read:

```text
git.md
```

Each changed file should receive its own staging and commit instructions according to that rule.

---

# Frontend Architecture

## 20. Server Components by Default

React Server Components are the default.

Do not add:

```tsx
'use client';
```

without a concrete client-side requirement.

Valid reasons may include:

* React state
* Effects
* Browser-only APIs
* Event-driven interactive behaviour
* Client-only libraries

Styling is not a reason to use a Client Component.

CSS Modules work with Server Components.

---

## 21. Keep Client Boundaries Small

When interactivity is needed, place the Client Component as deep as practical.

Prefer:

```text
Server Page
├── Server Header
├── Server Content
└── Client Filter
```

instead of turning the entire page into a Client Component.

---

# API Architecture

## 22. Backend Isolation

The browser must not know the Django backend address.

Never expose it through:

```text
NEXT_PUBLIC_*
```

or browser-side configuration.

---

## 23. Server-Only Endpoints

Backend endpoint functions belong under:

```text
src/endpoints/
```

Each backend endpoint should follow the structure defined in `api-integration.md`.

Server-only endpoint modules must use:

```ts
import 'server-only';
```

where required by the project's API rules.

---

## 24. Browser-Initiated Requests

When browser-side interaction requires backend communication, use:

```text
Browser
   ↓
/api/...
   ↓
Next.js Route Handler
   ↓
Server-only endpoint
   ↓
Django
```

Route handlers belong under:

```text
src/app/api/
```

Do not leak raw backend errors to the browser.

---

## 25. Server Component Requests

When a Server Component needs backend data, call the appropriate server-only endpoint function directly.

Do not unnecessarily route server-side requests through the application's own HTTP `/api` endpoint.

---

# Styling Architecture

## 26. CSS Modules

Every page or component requiring local styling should use a colocated `.module.css` file.

Examples:

```text
Button.tsx
Button.module.css
```

and:

```text
page.tsx
page.module.css
```

---

## 27. No Tailwind

Do not introduce Tailwind CSS.

Do not generate Tailwind utility classes.

Do not add Tailwind dependencies or configuration.

Do not recreate Tailwind as a custom global utility system.

---

## 28. Global Styles

Global application styles belong in:

```text
src/app/globals.css
```

This file should remain limited to genuinely global concerns.

Feature and component styling does not belong there.

---

## 29. Design Tokens

Shared visual values belong in:

```text
src/styles/tokens.css
```

This includes:

* Brand colours
* Semantic colours
* Text colours
* Surface colours
* Typography
* Spacing
* Radius
* Shadows
* Transitions
* Layout dimensions
* Z-index levels

Components should consume semantic tokens rather than repeatedly declaring raw values.

---

## 30. Typography

The functional admin typeface is:

```text
Outfit
```

Brand display fonts:

```text
Six Caps
Sacramento
```

must follow the restrictions in `design.md`.

Do not introduce DM Sans.

Do not inherit Prompt from the legacy Jazzmin admin.

---

# Quality Requirements

## 31. Accessibility

User-facing work should account for:

* Keyboard navigation
* Visible focus
* Colour contrast
* Semantic HTML
* Labels
* Error identification
* Reduced motion
* Appropriate interaction targets

Do not communicate important state through colour alone.

---

## 32. Loading States

Data-dependent interfaces should provide appropriate loading behaviour.

Prefer skeletons for content-heavy interfaces where practical.

Avoid unnecessary full-page spinners.

---

## 33. Empty States

Lists, tables, searches, and other data interfaces must intentionally handle empty results.

Do not leave unexplained blank sections.

---

## 34. Error States

Failures must produce intentional user-facing states.

Do not expose:

* Stack traces
* Internal exceptions
* Backend URLs
* Database details
* Tokens
* Internal correlation data unless explicitly permitted by the relevant rule

Follow `error-pages.md` for application-level error screens.

---

## 35. Responsive Behaviour

User-facing interfaces must remain usable at supported viewport sizes.

Do not treat desktop layout as the only required state.

Tables may use horizontal scrolling where preserving data is preferable to collapsing important columns.

---

## 36. Performance

Avoid unnecessary:

* Client Components
* Sequential independent requests
* Large client bundles
* Expensive re-renders
* Layout-triggering animations
* Unbounded lists

Use pagination for large administrative datasets.

Use virtualization when appropriate for very large rendered collections.

---

# Implementation Workflow

## 37. Before Coding

Before implementing a task:

1. Understand the requested behaviour.
2. Identify affected areas.
3. Read the applicable `.agents` rules.
4. Inspect existing patterns before introducing new ones.
5. Determine whether an existing component or abstraction should be reused.
6. Confirm that the proposed implementation respects security and architecture boundaries.

---

## 38. During Implementation

While implementing:

1. Keep changes focused.
2. Follow existing naming and folder conventions.
3. Preserve Server Components unless client behaviour is required.
4. Keep secrets and backend information server-side.
5. Use design tokens.
6. Use CSS Modules.
7. Handle relevant interaction states.
8. Consider accessibility.
9. Consider loading, empty, and error states.
10. Avoid unrelated refactoring.

---

## 39. After Implementation

Before considering work complete:

1. Review the diff.
2. Check for accidental unrelated changes.
3. Verify applicable agent rules.
4. Run the relevant project validation commands.
5. Resolve type errors.
6. Resolve lint errors.
7. Resolve build failures.
8. Verify responsive behaviour where UI changed.
9. Verify security boundaries where data flow changed.
10. Prepare Git handover commands according to `git.md`.

---

# Validation

## 40. Required Checks

Use the scripts provided by the project rather than inventing alternative validation workflows.

At minimum, where corresponding scripts exist, validate:

```text
TypeScript
ESLint
Build
Tests
```

Do not claim validation succeeded unless the command was actually run successfully.

---

## 41. UI Validation

For UI changes, additionally verify:

* CSS Module is correctly imported.
* No Tailwind utilities were introduced.
* No unnecessary inline styling was introduced.
* Shared values use design tokens.
* Raw brand colours are not duplicated unnecessarily.
* Responsive behaviour works.
* Focus states remain visible.
* Reduced motion is respected where animation exists.
* Loading states are intentional.
* Empty states are intentional.
* Error states are intentional.

---

## 42. API Validation

For API-related changes, verify:

* Backend address remains server-only.
* Endpoint modules remain server-only.
* Browser requests use Next.js `/api` routes where required.
* Server Components call server endpoint functions directly where appropriate.
* Backend error details are narrowed before reaching the browser.
* Authentication cookies remain secure.
* No secrets are exposed through client bundles.

---

# Git Handover

## 43. Do Not Mutate Git History

Follow `.agents/git.md`.

AI agents should not automatically stage, commit, push, merge, rebase, reset, revert, clean, or otherwise mutate repository history.

Instead, provide exact commands for the developer.

---

## 44. One File Per Commit

When providing Git commands, stage one file explicitly.

Example:

```bash
git add .agents/design.md
git commit -m "docs: add admin design guidelines"
```

Do not use:

```bash
git add .
```

Do not combine unrelated files into a single commit unless `git.md` explicitly permits the situation.

---

# Existing Next.js Agent Rules

The repository may contain an automatically generated Next.js agent-instruction block below this project-specific section.

That generated block must remain intact.

Do not manually rewrite, shorten, remove, or reinterpret generated framework instructions unless the framework tooling explicitly requires regeneration.

Project-specific NEXCODE rules and generated Next.js framework rules should be followed together.

If an apparent conflict exists, first determine whether the framework instruction is describing framework correctness while a NEXCODE rule is describing project architecture.

Prefer an implementation that satisfies both.

---

# Core Principle

Before changing NEXCODE Admin, determine:

```text
What am I changing?
        ↓
Which rules apply?
        ↓
What existing pattern already solves this?
        ↓
Does the solution preserve security and architecture?
        ↓
Does the UI follow design + styling rules?
        ↓
Can the implementation remain server-first?
        ↓
Validate
        ↓
Prepare Git handover
```

The goal is not simply to make a feature work.

The goal is to make it work **consistently with the rest of NEXCODE Admin**.

---

<!--
IMPORTANT:

If this AGENTS.md already contains an automatically generated Next.js
instruction block, preserve that block below this point exactly as it
currently exists.

Do not replace generated framework instructions with this comment.
The existing generated content should remain after the project-specific
NEXCODE rules above.
-->
