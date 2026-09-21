# Styling Rules

This document defines how styling must be implemented in the NEXCODE Admin application.

For visual direction, colours, typography, spacing philosophy, component appearance, interaction states, and other design decisions, follow:

```text
.agents/design.md
```

The distinction is:

* `design.md` defines **what the interface should look and feel like**.
* `styling.md` defines **how that design must be implemented in code**.

Both rules apply whenever creating or modifying user-facing UI.

---

## 1. Styling Architecture

NEXCODE Admin uses:

```text
CSS Modules + global design tokens
```

CSS Modules are the default and required styling method for pages and components.

Tailwind CSS must not be used.

CSS-in-JS libraries must not be introduced.

Do not introduce another styling framework unless the project's architecture is explicitly changed.

---

## 2. CSS Modules

Every page or component that requires styling should have its own colocated CSS Module.

Examples:

```text
src/components/Button/
├── Button.tsx
└── Button.module.css
```

```text
src/app/users/
├── page.tsx
└── page.module.css
```

```text
src/components/users/UserTable/
├── UserTable.tsx
└── UserTable.module.css
```

The stylesheet should remain close to the component or page that owns the styles.

Do not create large feature-wide stylesheets containing unrelated component styles.

---

## 3. CSS Module Naming

CSS Module files must use:

```text
<ComponentName>.module.css
```

for named components.

Examples:

```text
Button.module.css
Sidebar.module.css
UserTable.module.css
FilterBar.module.css
```

For Next.js route files, use:

```text
page.module.css
layout.module.css
```

where appropriate.

---

## 4. Importing CSS Modules

Import the module directly into the component that owns it.

Example:

```tsx
import styles from './Button.module.css';
```

Use module classes through the imported object:

```tsx
<button className={styles.button}>Save</button>
```

Do not depend on globally declared component classes.

---

## 5. Class Naming

CSS Module class names should describe purpose rather than visual implementation.

Prefer:

```css
.container
.header
.title
.actions
.input
.errorMessage
.active
```

Avoid names such as:

```css
.greenButton
.marginTop20
.flexRow
.bigText
```

Class names should remain meaningful if the visual implementation changes.

---

## 6. Tailwind CSS

Tailwind CSS is intentionally not part of the NEXCODE Admin styling architecture.

Do not:

* Add Tailwind utility classes.
* Add Tailwind configuration.
* Add Tailwind-specific PostCSS configuration.
* Install Tailwind packages.
* Copy Tailwind utility patterns into JSX.
* Introduce another utility-first framework as a replacement.

Do not write:

```tsx
<div className="flex items-center gap-4 rounded-lg">
```

Use a CSS Module instead:

```tsx
<div className={styles.container}>
```

with the layout defined in the corresponding `.module.css`.

---

## 7. Global CSS

The primary global stylesheet is:

```text
src/app/globals.css
```

Global CSS must remain intentionally small.

It may contain:

* CSS reset/base normalization.
* Root document behaviour.
* `html` and `body` defaults.
* Global box sizing.
* Base typography inheritance.
* Selection behaviour.
* Global accessibility defaults.
* Reduced-motion behaviour where globally appropriate.
* Other genuinely application-wide browser defaults.

It must not become a storage location for component styles.

Do not define feature-specific styles in `globals.css`.

---

## 8. Design Tokens

Shared design values belong in:

```text
src/styles/tokens.css
```

The token stylesheet should contain CSS custom properties for the design system.

Examples include:

```text
Colours
Typography
Spacing
Border radius
Shadows
Transitions
Layout dimensions
Z-index levels
```

`globals.css` should import the token stylesheet.

Components should consume these variables through their CSS Modules.

---

## 9. Token Usage

Use semantic design tokens whenever a value represents a shared design decision.

Example:

```css
.card {
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
```

Avoid:

```css
.card {
  color: #ffffff;
  background: #1e1d1e;
  border: 1px solid #393939;
  border-radius: 12px;
}
```

Shared visual values must have a single source of truth.

---

## 10. Raw Colours

Do not scatter raw colour values throughout CSS Modules.

Avoid:

```css
.button {
  background: #d0ff71;
}
```

Prefer:

```css
.button {
  background: var(--color-primary);
}
```

Raw brand and semantic colour definitions belong in the token system.

A literal colour may only be used locally when it is genuinely unique and cannot reasonably be represented by an existing design token.

Before introducing one, check `tokens.css`.

---

## 11. Primary Colour

The NEXCODE primary colour is:

```text
#D0FF71
```

Its canonical declaration belongs in `tokens.css`.

Components should reference:

```css
var(--color-primary)
```

or a more specific semantic token derived from it.

Do not repeatedly declare `#D0FF71` in component stylesheets.

---

## 12. Typography

The primary functional typeface is:

```text
Outfit
```

Do not use DM Sans.

Do not use Prompt from the legacy Django/Jazzmin admin.

Additional NEXCODE brand typefaces are:

```text
Six Caps
Sacramento
```

Their usage restrictions are defined in `design.md`.

Outfit must remain the default font for functional admin UI.

---

## 13. Font Loading

Fonts should be loaded through Next.js font optimisation where supported.

Prefer:

```tsx
import { Outfit } from 'next/font/google';
```

over CSS `@import` requests to external font providers.

Font loading should normally be configured in the root layout and exposed through CSS variables when multiple font families are required.

Example conceptual structure:

```tsx
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});
```

The exact configuration should match the fonts actually required by the application.

---

## 14. Font Tokens

Typography should be exposed through design tokens.

For example:

```css
--font-family-primary: var(--font-outfit);
--font-family-display: var(--font-six-caps);
--font-family-decorative: var(--font-sacramento);
```

Components should generally use semantic font tokens rather than referencing implementation-specific font variables directly.

---

## 15. Font Sizes

Repeated typography sizes should use tokens.

Prefer:

```css
.title {
  font-size: var(--font-size-xl);
}
```

rather than repeatedly declaring arbitrary sizes.

One-off responsive or highly component-specific values may be used when justified.

Do not create unnecessary tokens for every numeric value.

---

## 16. Spacing

Use the shared spacing scale for normal layout spacing.

Example:

```css
.card {
  padding: var(--space-lg);
  gap: var(--space-md);
}
```

Avoid arbitrary spacing when an existing token expresses the same design intent.

Component-specific measurements are acceptable where they represent actual structural requirements rather than general spacing.

---

## 17. Border Radius

Use radius tokens.

Example:

```css
.input {
  border-radius: var(--radius-md);
}
```

Do not repeatedly hard-code common radius values across components.

---

## 18. Shadows

Use shared shadow tokens for reusable elevation levels.

Example:

```css
.dropdown {
  box-shadow: var(--shadow-elevated);
}
```

Do not create arbitrary decorative shadows for individual cards.

Follow the restrained elevation system defined in `design.md`.

---

## 19. Transitions

Shared transition durations and easing should use tokens.

Example:

```css
.button {
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}
```

Transitions should be short and functional.

---

## 20. Animation Performance

Prefer animating:

```text
opacity
transform
```

Avoid unnecessary animation of layout-affecting properties such as:

```text
width
height
top
left
margin
padding
```

when a transform-based implementation can achieve the same result.

Animation must follow the performance rules in:

```text
.agents/performance.md
```

---

## 21. Reduced Motion

Interfaces with motion must respect:

```css
@media (prefers-reduced-motion: reduce)
```

Animations and transitions should be removed or substantially reduced when requested by the user's operating system.

Do not make essential information dependent on animation.

---

## 22. Responsive Styling

Use CSS media queries inside the component or page's CSS Module when responsive behaviour belongs to that component.

Example:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

Shared breakpoints may be documented centrally where necessary, but CSS custom properties must not be assumed to work inside media-query conditions.

Keep responsive rules close to the UI they affect.

---

## 23. Layout Techniques

Prefer modern CSS layout systems.

Use:

```text
Flexbox
CSS Grid
Intrinsic sizing
min()
max()
clamp()
```

where appropriate.

Avoid JavaScript-based layout calculations when CSS can solve the problem reliably.

---

## 24. Component Boundaries

A component should own its visual implementation.

Do not make a parent page stylesheet deeply control the internal DOM structure of unrelated child components.

Prefer:

```text
Component
└── Component.module.css
```

over a page stylesheet that knows implementation details of every nested component.

This keeps components reusable and reduces accidental coupling.

---

## 25. Composition

Parents may control layout around child components.

For example, a page may determine:

* Grid placement
* Section spacing
* Container width
* Page-level alignment

The child component should control its own internal appearance.

---

## 26. Global Selectors

Avoid global selectors unless they are required for genuine application-wide behaviour.

Do not use:

```css
:global(...)
```

as a shortcut around CSS Module boundaries.

If `:global()` is required, keep its scope as narrow as possible and document unusual usage.

---

## 27. Inline Styles

Static visual styling should not be written inline.

Avoid:

```tsx
<div style={{ padding: '20px', color: '#fff' }}>
```

Use CSS Modules.

Inline styles may be appropriate for truly dynamic values that cannot reasonably be represented through predefined classes or CSS variables.

Example:

```tsx
<div
  className={styles.progress}
  style={{ '--progress': `${progress}%` } as React.CSSProperties}
/>
```

Even in these cases, keep the actual visual rules inside the CSS Module.

---

## 28. Dynamic Classes

For state-based styling, use clear conditional classes.

Example:

```tsx
className={`${styles.item} ${active ? styles.active : ''}`}
```

A class-composition utility may be used if the project already provides one or there is sufficient reason to introduce one.

Do not add dependencies merely to combine two simple class names.

---

## 29. State Styling

Components should explicitly account for applicable states such as:

```text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
Success
```

Do not implement only the default visual state.

State appearance must follow `design.md`.

---

## 30. Hover

Hover styling should only be used for devices that support hover when the interaction would otherwise cause undesirable behaviour on touch devices.

Where useful:

```css
@media (hover: hover) {
  .button:hover {
    /* hover state */
  }
}
```

Do not make functionality dependent on hover.

---

## 31. Focus

Use:

```css
:focus-visible
```

for keyboard-focused visual indicators where appropriate.

Example:

```css
.button:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus);
  outline-offset: var(--focus-ring-offset);
}
```

Never remove focus indicators without an accessible replacement.

---

## 32. Disabled Controls

Use semantic disabled selectors where possible.

Example:

```css
.button:disabled {
  cursor: not-allowed;
}
```

Visual treatment should come from design tokens.

Do not depend exclusively on opacity to indicate a disabled state.

---

## 33. Form Controls

Native form controls should be styled through their component CSS Modules.

Shared input components should own common field behaviour.

Avoid independently recreating the same input styling in multiple pages.

Common form elements should eventually converge on reusable components such as:

```text
Input
Textarea
Select
Checkbox
Radio
Switch
Field
```

where the application actually needs them.

---

## 34. Tables

Table styling should normally live with the reusable table or feature-specific table component.

Do not put application-wide table styles into `globals.css`.

Different table features may require different layouts while still consuming the same tokens and design principles.

---

## 35. Icons

Icon colour and size should generally be controlled by the owning component stylesheet.

Prefer icons that inherit text colour through:

```css
currentColor
```

when supported.

This makes hover, active, disabled, and semantic states easier to maintain.

---

## 36. SVG

Simple interface SVGs should normally inherit semantic styling rather than hard-coding brand colours.

Prefer:

```svg
fill="currentColor"
```

where appropriate.

Do not duplicate raw design colours inside SVG markup when the colour should follow application state.

Feature-specific SVG rules may override this when necessary.

---

## 37. Images

Use Next.js image optimisation for applicable application images.

CSS should control presentation and layout.

Avoid using CSS background images for meaningful content that should have semantic image markup.

---

## 38. Z-Index

Do not introduce arbitrary large z-index values such as:

```css
z-index: 999999;
```

Shared application layers should use defined tokens.

Typical conceptual layers include:

```text
Base
Sticky
Dropdown
Overlay
Modal
Toast
```

The actual values belong in `tokens.css`.

---

## 39. Specificity

Keep selector specificity low.

Prefer:

```css
.item {}
.itemActive {}
```

over:

```css
.sidebar .navigation ul li a.active {}
```

CSS Modules already provide local scoping.

Do not recreate global-CSS specificity problems inside modules.

---

## 40. `!important`

Avoid `!important`.

It should only be used when overriding behaviour that cannot reasonably be controlled through normal cascade, specificity, or third-party integration boundaries.

If used, the reason should be clear from the surrounding code or a short comment.

---

## 41. Nesting

Do not create deeply nested CSS structures.

Styles should reflect component boundaries rather than DOM depth.

Keep selectors simple and maintainable.

---

## 42. Pseudo-Elements

Pseudo-elements are appropriate for decorative or state-related details.

They must not contain important textual information required to understand the interface.

Important content belongs in the DOM.

---

## 43. Accessibility

Styling must preserve accessibility.

Do not:

* Remove focus visibility.
* Communicate meaning only through colour.
* Make disabled content unreadable.
* Create insufficient text contrast.
* hide meaningful content from assistive technologies purely for visual convenience.

Accessibility requirements in `design.md` remain applicable.

---

## 44. Scrollbars

Do not globally replace or heavily customise browser scrollbars without a strong product requirement.

Feature-specific scroll areas may receive restrained scrollbar styling when necessary.

The interface must remain usable across supported browsers.

---

## 45. Overflow

Handle overflow intentionally.

For example, data tables may use:

```css
overflow-x: auto;
```

when the table cannot reasonably collapse.

Do not globally hide overflow to conceal layout problems.

---

## 46. Text Overflow

Use truncation only where the complete value is not required for immediate understanding.

Example:

```css
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Where important information is truncated, provide an accessible way to inspect the complete value when appropriate.

---

## 47. CSS Duplication

Before adding a repeated pattern, check whether an existing shared component should own it.

Do not solve duplication by creating a global utility-class system that recreates Tailwind.

Reusable visual behaviour should normally be implemented through reusable React components and design tokens.

---

## 48. Utility Classes

Avoid building a large custom utility-class framework.

Classes such as:

```text
.flex
.mt-4
.p-6
.text-green
.rounded-lg
```

should not become the application's styling model.

CSS Modules should describe components and their states.

---

## 49. Third-Party Components

When using a third-party component library, styling must still align with the NEXCODE design system.

Do not allow a library's default visual theme to create a competing design language.

Where possible:

* Use supported theming APIs.
* Map library values to NEXCODE tokens.
* Keep overrides scoped.
* Avoid fragile DOM-dependent selectors.

Do not add a UI library solely to avoid implementing ordinary project components.

---

## 50. Server and Client Components

Styling does not require a component to become a Client Component.

A Server Component can import and use CSS Modules.

Do not add:

```tsx
'use client';
```

only because a component needs styling.

Client Components should only be introduced when client-side behaviour requires them.

Follow:

```text
.agents/architecture.md
.agents/performance.md
```

---

## 51. File Ownership

A component stylesheet should be changed together with the component it represents when their behaviour is related.

Do not create unrelated CSS changes in a stylesheet simply because it is convenient.

Keep changes focused.

---

## 52. Comments

CSS comments should explain non-obvious decisions, not obvious syntax.

Useful:

```css
/*
 * Keep the table horizontally scrollable rather than collapsing columns,
 * because audit records require all identifiers to remain accessible.
 */
```

Unnecessary:

```css
/* Add padding */
padding: var(--space-md);
```

---

## 53. Legacy Styles

Do not copy legacy Django/Jazzmin CSS directly into the Next.js admin.

Legacy styles may be inspected to understand:

* Brand colours
* Typography
* Existing identity
* Useful visual references

They should then be translated into the new token-based CSS Module architecture.

Do not carry forward:

* Legacy selector structures
* Jazzmin-specific overrides
* Bootstrap-specific overrides
* Prompt typography
* Global component styling

unless there is an explicit requirement.

---

## 54. Design Rule Relationship

When implementing a UI, apply the rules in this order:

```text
design.md
    ↓
tokens.css
    ↓
styling.md
    ↓
component/page CSS Module
```

`design.md` establishes the design decision.

`tokens.css` exposes reusable design values.

`styling.md` defines the implementation method.

The local CSS Module applies those rules to the component.

---

## 55. Example

Correct structure:

```text
src/components/Button/
├── Button.tsx
└── Button.module.css
```

```tsx
import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
};

export function Button({ children }: ButtonProps) {
  return (
    <button className={styles.button} type="button">
      {children}
    </button>
  );
}
```

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);

  min-height: var(--control-height-md);
  padding-inline: var(--space-md);

  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);

  color: var(--color-text-on-primary);
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);

  cursor: pointer;

  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.button:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus);
  outline-offset: var(--focus-ring-offset);
}

.button:disabled {
  color: var(--color-text-disabled);
  background: var(--color-surface-disabled);
  border-color: var(--color-border);
  cursor: not-allowed;
}

@media (hover: hover) {
  .button:not(:disabled):hover {
    background: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }
}
```

This keeps:

* Structure in React.
* Styling in the CSS Module.
* Shared values in tokens.
* Visual decisions aligned with `design.md`.

---

## 56. Styling Checklist

Before considering UI styling complete, verify:

* CSS Modules are used.
* The page/component owns its stylesheet.
* Tailwind is not used.
* CSS-in-JS has not been introduced.
* Component styles are not placed in `globals.css`.
* Shared values come from `tokens.css`.
* Raw brand colours are not scattered through modules.
* Outfit remains the primary interface font.
* DM Sans is not used.
* Prompt is not inherited from Jazzmin.
* Six Caps and Sacramento follow their design restrictions.
* Hover states are implemented where appropriate.
* Focus-visible states are accessible.
* Disabled states are clear.
* Error and semantic states are supported where applicable.
* Responsive behaviour is implemented.
* Reduced motion is respected.
* Selectors remain simple.
* `!important` is avoided.
* Z-index values follow the shared layer system.
* Styling has not forced an unnecessary Client Component.
* Repeated UI patterns use shared components rather than duplicated CSS.
* The implementation matches `.agents/design.md`.

---

## 57. Core Rule

The NEXCODE Admin styling architecture is:

**design tokens + CSS Modules + colocated component styles.**

Global CSS establishes the application foundation.

Design tokens provide shared values.

CSS Modules implement individual interfaces.

React components define structure and behaviour.

Do not mix these responsibilities unnecessarily.
