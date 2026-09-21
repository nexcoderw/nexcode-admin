# NEXCODE Admin

NEXCODE Admin is the administrative web application for the NEXCODE platform.

It provides the internal interface used to manage NEXCODE data, users, operational workflows, platform activity, and other administrative functionality exposed by the NEXCODE backend.

The application is built with **Next.js, React, and TypeScript** and communicates with the NEXCODE Django backend through a server-controlled integration layer.

---

## Overview

NEXCODE Admin is designed as a secure, server-first administrative application.

The architecture intentionally separates:

* Browser-facing UI
* Next.js server logic
* Backend API communication
* Django business logic and authorization

The browser must never communicate directly with the Django backend.

The expected request flow is:

```text
Browser
   │
   ▼
NEXCODE Admin
Next.js application
   │
   ▼
Server-only endpoint layer
   │
   ▼
NEXCODE Django API
```

For browser-initiated mutations or interactive requests:

```text
Browser
   │
   ▼
Next.js /api/...
   │
   ▼
Server-only endpoint
   │
   ▼
NEXCODE Django API
```

For Server Components, the server-only endpoint layer should be called directly without unnecessarily routing the request through the application's own HTTP API.

---

## Technology

The application uses:

* Next.js
* React
* TypeScript
* ESLint
* CSS Modules
* Next.js font optimisation

Refer to `package.json` for the exact dependency versions used by the current project.

---

## Backend

The backend for this application is maintained separately in the `nexcode-django` repository.

The Django application owns backend responsibilities such as:

* Business logic
* Database access
* Authorization
* Backend authentication behaviour
* API validation
* Administrative operations
* Persistent application data

The Next.js admin must not attempt to replace backend authorization with frontend-only checks.

The backend remains the final authorization boundary.

---

## Architecture

NEXCODE Admin follows a server-first architecture.

### Server Components

React Server Components should be used by default.

They are appropriate for:

* Page composition
* Server-side data retrieval
* Non-interactive content
* Backend-connected views
* Secure access to server-only configuration

Do not add `'use client'` unless client-side behaviour requires it.

### Client Components

Client Components should be limited to interfaces that require capabilities such as:

* React state
* Event-driven interaction
* Effects
* Browser APIs
* Client-only libraries

Keep Client Component boundaries as deep in the component tree as practical.

A small interactive control should not force an entire page to become client-rendered.

---

## API Integration

Backend communication is isolated from the browser.

Server-only backend endpoint functions belong under:

```text
src/endpoints/
```

These modules are responsible for communicating with the Django API.

Where required by the project rules, endpoint modules must explicitly use:

```ts
import 'server-only';
```

Browser code must not import server-only endpoint modules.

---

## Browser-Initiated API Requests

When a Client Component needs to perform a backend operation, it should communicate with the Next.js application through:

```text
src/app/api/
```

The request flow becomes:

```text
Client Component
      │
      ▼
Next.js Route Handler
      │
      ▼
Server-only endpoint
      │
      ▼
Django API
```

This keeps backend infrastructure and sensitive server configuration outside the browser bundle.

---

## Backend URLs

The Django backend address is server-only configuration.

It must never be exposed through a variable such as:

```text
NEXT_PUBLIC_API_URL
```

or any other `NEXT_PUBLIC_*` environment variable.

Only configuration intentionally safe for browser access may use the `NEXT_PUBLIC_*` prefix.

See:

```text
.agents/environment.md
.agents/api-integration.md
.agents/security.md
```

for the complete rules.

---

# Styling

## CSS Modules

NEXCODE Admin intentionally uses **CSS Modules** instead of Tailwind CSS.

Pages and components should own their styles through colocated `.module.css` files.

Example:

```text
src/components/Button/
├── Button.tsx
└── Button.module.css
```

A route may use:

```text
src/app/users/
├── page.tsx
└── page.module.css
```

Component-specific styles should not be placed in the global stylesheet.

---

## No Tailwind CSS

Tailwind CSS is intentionally not part of the project's styling architecture.

Do not:

* Add Tailwind dependencies.
* Add Tailwind configuration.
* Add Tailwind utility classes.
* Introduce another utility-first framework as a replacement.
* Build a large custom global utility system that recreates Tailwind.

The project styling model is:

```text
Design system
      │
      ▼
Design tokens
      │
      ▼
CSS Modules
      │
      ▼
Pages and components
```

---

## Design System

The NEXCODE Admin design system is based on the visual identity of the main NEXCODE platform while being adapted for a professional, data-heavy administrative interface.

The core brand colour is:

```text
#D0FF71
```

The interface uses a dark surface system derived from the existing NEXCODE identity, including:

```text
#0D0D0D
#100F0F
#1E1D1E
```

Shared colours and other visual values must be consumed through design tokens rather than repeatedly hard-coded in component styles.

The full visual specification is documented in:

```text
.agents/design.md
```

---

## Typography

The primary functional typeface is:

```text
Outfit
```

It is used for normal administrative UI, including:

* Navigation
* Forms
* Tables
* Buttons
* Labels
* Headings
* Body text
* Dialogs

The NEXCODE brand also uses:

```text
Six Caps
Sacramento
```

These are restricted display/decorative fonts and should not replace Outfit in functional administrative UI.

The `Prompt` typeface used by the legacy Django/Jazzmin administration interface is not the default typography for this application.

Fonts should be loaded through `next/font` where supported.

---

## Design Tokens

Shared design values are defined in:

```text
src/styles/tokens.css
```

The token system includes:

* Brand colours
* Surface colours
* Text colours
* Border colours
* Semantic status colours
* Typography
* Spacing
* Border radius
* Shadows
* Control dimensions
* Transitions
* Layout dimensions
* Z-index layers

Components should prefer semantic tokens.

For example:

```css
.card {
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

instead of duplicating raw design values.

---

## Global Styles

Application-wide styles live in:

```text
src/app/globals.css
```

This stylesheet is reserved for genuinely global concerns such as:

* Reset behaviour
* Box sizing
* Base document styles
* Typography inheritance
* Global focus fallback
* Selection styling
* Form inheritance
* Reduced-motion defaults

Component and feature styles belong in CSS Modules.

---

# Project Structure

The exact structure will evolve as features are implemented, but the application follows responsibilities similar to:

```text
nexcode-admin/
├── .agents/
│   ├── architecture.md
│   ├── api-integration.md
│   ├── audit-logs.md
│   ├── design.md
│   ├── environment.md
│   ├── error-pages.md
│   ├── folder-structure.md
│   ├── git.md
│   ├── performance.md
│   ├── security.md
│   └── styling.md
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── ...
│   │
│   ├── components/
│   │   └── ...
│   │
│   ├── constants/
│   │   └── ...
│   │
│   ├── endpoints/
│   │   └── ...
│   │
│   ├── styles/
│   │   └── tokens.css
│   │
│   └── ...
│
├── AGENTS.md
├── README.md
├── package.json
└── ...
```

The canonical folder rules are defined in:

```text
.agents/folder-structure.md
```

Follow that file when adding or reorganising project files.

---

# Design Principles

The administrative interface should be:

* Clear
* Consistent
* Accessible
* Efficient
* Responsive
* Professional
* Data-oriented
* Visually connected to NEXCODE

The public NEXCODE website may use more expressive marketing layouts and typography.

The admin application deliberately uses a more restrained interpretation of the same brand.

Administrative usability takes priority over decoration.

---

## Accessibility

Accessibility is a core implementation requirement.

Interfaces should provide:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Appropriate colour contrast
* Form labels
* Understandable errors
* Reduced-motion support
* Clear interactive states

Important information must not be communicated through colour alone.

---

## Responsive Design

Administrative interfaces must remain usable across supported viewport sizes.

Responsive behaviour may include:

* Collapsible navigation
* Reduced page padding
* Single-column forms
* Wrapping action groups
* Responsive cards
* Horizontally scrollable data tables

Essential functionality should not simply disappear on smaller screens.

---

## Loading States

Data-dependent interfaces should provide intentional loading states.

Use skeleton interfaces for content-heavy areas where appropriate.

Avoid replacing an entire interface with a generic spinner when the expected layout can be represented more clearly.

---

## Empty States

Lists, tables, search results, and other data interfaces must intentionally handle empty datasets.

An empty state should explain what is empty and, where appropriate, what the administrator can do next.

---

## Error States

Errors must be useful to administrators without exposing internal system details.

Never expose sensitive information such as:

* Stack traces
* Internal backend URLs
* Database information
* Authentication tokens
* Internal exception details

Application error-page requirements are defined in:

```text
.agents/error-pages.md
```

---

# Security

Security boundaries must be maintained throughout the application.

Key requirements include:

* Secrets remain server-side.
* Backend addresses remain server-side.
* Authentication tokens are not exposed to browser JavaScript when they should be protected by secure cookies.
* The Django backend remains the authorization boundary.
* Backend errors are narrowed before reaching the browser.
* Sensitive implementation details are not logged or rendered to users.
* User-controlled HTML must not be rendered unsafely.

Refer to:

```text
.agents/security.md
```

before implementing authentication, authorization, API, cookie, or sensitive-data functionality.

---

# Performance

The application should remain server-first and avoid unnecessary client-side JavaScript.

Important principles include:

* Prefer Server Components.
* Keep Client Components small.
* Parallelise independent server requests where appropriate.
* Paginate large datasets.
* Consider virtualization for very large rendered collections.
* Dynamically load heavy, rarely used client functionality where appropriate.
* Animate `opacity` and `transform` where possible.
* Avoid unnecessary layout-triggering animation.
* Use Next.js font optimisation.

See:

```text
.agents/performance.md
```

for the complete performance requirements.

---

# Environment Configuration

Environment-specific configuration should be documented through:

```text
.env.example
```

Local secrets and machine-specific configuration belong in:

```text
.env.local
```

and must not be committed.

Server-only values must remain server-only.

Never assume that prefixing a value with `NEXT_PUBLIC_` is harmless. That prefix intentionally exposes the value to browser code.

See:

```text
.agents/environment.md
```

for the complete environment rules.

---

# Development

Install dependencies:

```bash
npm install
```

Start the development server using the development script defined in `package.json`:

```bash
npm run dev
```

Then open the local address printed by Next.js.

Do not hard-code a development port into documentation unless the project explicitly configures one.

---

# Production Build

Create a production build with:

```bash
npm run build
```

Start the production application using the project's configured start script:

```bash
npm run start
```

---

# Code Quality

Before handing over a change, run the validation scripts available in `package.json`.

At minimum, where the corresponding scripts exist, validate:

```text
TypeScript
Linting
Tests
Production build
```

Use the project's existing scripts rather than creating alternative validation commands without a reason.

Do not claim a check passed unless it was actually run successfully.

---

# Development Rules

Project-specific implementation instructions live under:

```text
.agents/
```

The root:

```text
AGENTS.md
```

acts as the rule router and explains which rules apply to different categories of work.

Before implementing a task, identify and read the applicable rules.

Typical examples:

```text
UI work
→ design + styling + folder structure + performance

API work
→ architecture + API integration + security

Authentication
→ architecture + API integration + security + environment

Audit logs
→ audit logs + architecture + API integration + design
  + styling + security + performance

Error pages
→ error pages + design + styling + security where applicable
```

Rules are cumulative.

A feature-specific rule does not disable the project's general architecture, security, design, or performance requirements.

---

# Git Workflow

Git behaviour is governed by:

```text
.agents/git.md
```

AI agents must follow the restrictions defined there.

Changes should be handed back with explicit file-level Git commands.

Do not use broad staging commands such as:

```bash
git add .
git add -A
git add -u
```

when the project rule requires explicit file staging.

---

# Related Project

The NEXCODE Django application contains the backend and the original NEXCODE visual identity that informed this admin application's design system.

Repository:

```text
https://github.com/nexcoderw/nexcode-django
```

The two applications have different responsibilities:

```text
nexcode-django
      │
      ├── Backend
      ├── Business logic
      ├── Database
      ├── Authorization
      └── API
             ▲
             │
      server-side requests
             │
nexcode-admin
      │
      ├── Administrative UI
      ├── Server Components
      ├── Route handlers
      ├── Backend endpoint layer
      └── Admin workflows
```

Do not couple the browser directly to Django merely because both applications belong to the same platform.

---

# Core Principle

NEXCODE Admin should remain:

**secure, server-first, consistent, accessible, maintainable, and recognisably NEXCODE.**

When implementing a feature, follow the established architecture instead of choosing the shortest local solution.

When implementing UI, use the shared design system instead of creating isolated visual patterns.

When handling protected data, preserve the server boundary instead of exposing backend infrastructure to the browser.
