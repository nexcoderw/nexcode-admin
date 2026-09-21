# Styling

> Status: Mandatory
> Last reviewed: 2026-09-01

## No Tailwind

Tailwind, and any other utility-class framework, is **not used in this project**
and must not be installed. No `className="flex items-center gap-4"`, no
`@apply`, no utility class strings of any kind.

The reason is legibility: a component's markup should describe what it *is*, and
its stylesheet should describe how it looks. Mixing the two makes both harder to
read and makes a design change a search-and-replace across markup.

## CSS Modules Only

Every page and every component has its own `.module.css` file, sitting beside
it:

```text
components/bookings/BookingTable.tsx
components/bookings/BookingTable.module.css

app/(dashboard)/bookings/page.tsx
app/(dashboard)/bookings/page.module.css
```

Rules:

- One stylesheet per component. Never one stylesheet shared by several.
- Never a global class name for something one component uses.
- Never inline `style={{ ... }}` except for a value only known at runtime, such
  as a computed bar width — and then with a comment saying why.
- Never a CSS-in-JS library.

## What Belongs In `globals.css`

`app/globals.css` is for what is genuinely global, and nothing else:

- The CSS reset and box-sizing rules.
- The design tokens import (`styles/tokens.css`).
- `html`, `body`, and root element defaults.
- Base typography: the font family, base size, line height, heading scale.
- Focus-visible styling, so keyboard focus is consistent everywhere.
- Selection colour and scrollbar styling.
- A `@media (prefers-reduced-motion)` block.

**Never in `globals.css`:** a class for one component, a page layout, a utility
class, or anything with a feature name in it. If a rule would not apply to the
entire portal, it belongs in a module.

## Design Tokens

All colour, spacing, radius, shadow, and breakpoint values live as CSS custom
properties in `styles/tokens.css`, imported once by `globals.css`. Modules
reference tokens; they never hard-code a hex value.

```css
/* BookingTable.module.css */
.header {
  background: var(--color-surface);
  color: var(--color-text-strong);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}
```

A raw hex value in a module is a defect. The one exception is a token
definition itself.

## Class Naming

Inside a module, class names are `camelCase` so they read naturally in
TypeScript (`styles.tableHeader`). Names describe the element's role, not its
appearance:

```css
/* Correct */
.tableHeader { }
.rowSelected { }
.emptyState { }

/* Wrong — describes appearance, so it lies the moment the design changes */
.greenText { }
.marginTop16 { }
.bigBoldTitle { }
```

## Font

The portal uses **DM Sans**, loaded once through `next/font/google` in the root
layout and exposed as a CSS variable:

```ts
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});
```

`next/font` self-hosts the files, so there is no request to Google at runtime
and no layout shift while the font loads. No other font family is added without
a decision recorded here. Monospace is only for code, token, and identifier
display, using the system monospace stack.

## Structure Of A Module File

Order rules the way the element is built, so a reader can follow it:

1. The block's root class.
2. Its direct children, in document order.
3. State variants (`.rowSelected`, `.buttonDisabled`).
4. Media queries, at the end, largest breakpoint first.

Keep a module under 150 lines. A longer one usually means the component itself
should have been split.

## Composition Over Variants

A component with five boolean style props is harder to use than three
components. Prefer composing small pieces. Where variants are genuinely right,
express them as a single `variant` prop mapped to module classes:

```tsx
const styles = { primary: css.primary, ghost: css.ghost, danger: css.danger };
```

## Checklist

- [ ] No Tailwind or utility classes anywhere.
- [ ] Every component has its own `.module.css`.
- [ ] No raw hex, rgb, or px colour value outside `tokens.css`.
- [ ] `globals.css` contains nothing feature-specific.
- [ ] Class names describe role, not appearance.
- [ ] No inline styles without a documented runtime reason.
