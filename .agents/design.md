# NEXCODE Admin Design Rules

This document defines the visual design system and user-interface principles for the NEXCODE Admin application.

It describes **what the application should look and feel like**.

Technical implementation rules — including CSS Modules, file placement, selectors, and stylesheet architecture — belong in `styling.md`.

When building or modifying any user-facing interface, this file must be followed together with `styling.md`.

---

## 1. Design Direction

NEXCODE Admin must feel:

* Professional
* Modern
* Clean
* Precise
* Operational
* Consistent
* Accessible
* Fast and responsive

The admin application inherits its visual identity from the main NEXCODE platform but must adapt that identity for a data-heavy administrative environment.

The public NEXCODE website may use expressive typography, large visual elements, animations, and marketing-oriented layouts.

The admin application must be more restrained.

Clarity, information hierarchy, usability, and efficiency take priority over decoration.

---

## 2. Brand Foundation

The NEXCODE brand uses a dark visual system with a bright green primary accent.

### Primary colour

The primary NEXCODE colour is:

```css
#D0FF71
```

This is the definitive brand accent for the admin application.

Use the primary colour for:

* Primary actions
* Active navigation
* Selected states
* Focus indicators
* Important interactive highlights
* Active tabs
* Small brand accents
* Progress indicators where appropriate

Do not use the primary colour indiscriminately.

Large areas of bright green should generally be avoided because they reduce the professional, operational character of the admin interface.

---

## 3. Core Brand Colours

The original NEXCODE design provides the following core colours:

```css
Primary:        #D0FF71
Background:     #0D0D0D
Dark Surface:   #100F0F
Surface:        #1E1D1E
```

Supporting neutral colours found in the existing NEXCODE design include:

```css
#111111
#1D1D1D
#212121
#393939
#4D4949
#A4A4A4
#E1E1E1
#FFFFFF
```

These values form the basis of the admin design system.

Actual application code should consume semantic design tokens rather than repeatedly using raw colour values.

The canonical token definitions belong in:

```text
src/styles/tokens.css
```

---

## 4. Colour Roles

Colours must represent purpose rather than arbitrary visual preference.

The design system should provide semantic roles such as:

```text
Primary
Background
Surface
Elevated Surface
Interactive Surface
Border
Strong Border

Primary Text
Secondary Text
Muted Text
Disabled Text
Inverse Text

Success
Warning
Error
Information
```

Components should reference these semantic roles through design tokens.

For example, a card should use a surface token rather than declaring `#1E1D1E` directly.

This allows the visual system to evolve without rewriting individual components.

---

## 5. Surface Hierarchy

The interface should use subtle differences between dark surfaces to establish hierarchy.

A typical hierarchy is:

```text
Application background
    ↓
Navigation / sidebar
    ↓
Content surface
    ↓
Card / table / panel
    ↓
Elevated surface
    ↓
Modal / popover / dropdown
```

Hierarchy should primarily be communicated through:

* Surface tone
* Borders
* Spacing
* Typography
* Limited shadow
* Position

Avoid excessive shadows.

Dark interfaces generally benefit more from controlled surface and border differences than large drop shadows.

---

## 6. Typography

### Primary Typeface

The primary interface font is:

```text
Outfit
```

Outfit should be used for:

* Navigation
* Buttons
* Forms
* Tables
* Labels
* Body text
* Page titles
* Dialogs
* Notifications
* Administrative data

Outfit is the default typeface for the admin application.

---

## 7. Display Typeface

The NEXCODE public design also uses:

```text
Six Caps
```

Six Caps is a display typeface.

It may only be used sparingly for deliberate brand-oriented display elements.

It should NOT be used for:

* Body text
* Form fields
* Buttons
* Tables
* Navigation
* Dialogs
* Error messages
* Dense administrative content

Most admin screens should not require Six Caps.

Readability takes priority.

---

## 8. Decorative Typeface

The NEXCODE brand also uses:

```text
Sacramento
```

Sacramento is decorative.

Its use in the admin application should be extremely limited.

Do not use Sacramento for functional interface content.

It may only appear in rare decorative or branding contexts where readability and accessibility are unaffected.

---

## 9. Legacy Django Admin Typography

The legacy Django/Jazzmin admin uses:

```text
Prompt
```

Prompt is considered part of the legacy Jazzmin administration theme.

It is NOT the typography source for the new Next.js admin application.

Do not introduce Prompt into the new admin unless a future design decision explicitly changes the design system.

---

## 10. Typography Hierarchy

Typography must communicate information hierarchy clearly.

The system should define reusable levels for:

```text
Display
Page title
Section title
Card title
Body
Small body
Label
Caption
Metadata
```

Avoid arbitrary font sizes inside components.

Typography should use shared design tokens whenever practical.

Page titles should be prominent without becoming marketing-style hero headings.

Administrative interfaces should favour compact, readable hierarchy.

---

## 11. Font Weight

Use font weight intentionally.

Recommended hierarchy:

```text
Regular      — body and supporting text
Medium       — labels and secondary emphasis
Semi-bold    — buttons, navigation and headings
Bold         — limited strong emphasis
```

Avoid excessive bold text.

Hierarchy should not depend entirely on font weight.

Use size, spacing, colour, and placement together.

---

## 12. Spacing

Spacing must follow a consistent scale.

Do not introduce arbitrary spacing values without a clear reason.

The token system should provide reusable spacing values for:

```text
Extra small
Small
Medium
Large
Extra large
Section spacing
Page spacing
```

Spacing should communicate relationships.

Elements that belong together should be closer together.

Separate sections should receive visibly larger spacing.

---

## 13. Layout

Admin pages should follow a predictable layout.

A standard page generally consists of:

```text
Application shell
├── Sidebar
├── Header
└── Main content
    ├── Page header
    ├── Actions / filters
    ├── Primary content
    └── Pagination or supporting controls
```

Individual features may differ, but the overall information architecture should remain consistent.

---

## 14. Content Width

Administrative content should use available screen space efficiently.

Data-heavy pages such as:

* Users
* Audit logs
* Transactions
* Applications
* Reports
* Activity history

may use wider layouts than settings or form pages.

Do not artificially constrain large tables to narrow marketing-style containers.

At the same time, long text and forms should not stretch unnecessarily across very wide screens.

---

## 15. Responsive Design

Every interface must remain usable across supported viewport sizes.

Responsive behaviour should prioritise functionality.

Examples include:

* Sidebar collapsing when necessary
* Tables becoming horizontally scrollable where appropriate
* Action groups wrapping cleanly
* Forms changing from multiple columns to a single column
* Dialogs respecting viewport dimensions
* Page padding decreasing on smaller screens

Do not hide essential functionality merely to make a mobile layout visually simpler.

---

## 16. Borders

Borders are important in the dark admin interface.

Use subtle borders to separate:

* Cards
* Tables
* Inputs
* Dropdowns
* Modals
* Sidebars
* Panels
* Sections

Borders should normally remain low contrast.

Stronger borders may be used for:

* Focus
* Error
* Selected state
* Important separation

Avoid heavy borders throughout the interface.

---

## 17. Border Radius

Border radius must be consistent.

The system should define reusable radius tokens such as:

```text
Small
Medium
Large
Round
```

Use smaller radii for:

* Inputs
* Buttons
* Tags
* Compact controls

Use medium or larger radii for:

* Cards
* Panels
* Dialogs

Fully rounded shapes should normally be reserved for:

* Avatars
* Status dots
* Pills
* Icon controls where appropriate

Avoid excessive rounding that makes the application appear playful rather than professional.

---

## 18. Shadows

Shadows should be restrained.

Prefer:

* Surface contrast
* Borders
* Layering

before adding shadows.

Shadows are appropriate for genuinely elevated elements such as:

* Dropdowns
* Popovers
* Dialogs
* Floating menus

Avoid large decorative shadows on ordinary cards.

---

## 19. Buttons

Buttons must communicate hierarchy.

The design system should support at least:

```text
Primary
Secondary
Tertiary / Ghost
Danger
```

### Primary

Primary buttons use the NEXCODE primary colour and represent the main action in a context.

Avoid displaying many primary buttons together.

### Secondary

Secondary actions should remain visually quieter than the primary action.

### Ghost

Ghost buttons are appropriate for low-emphasis actions, compact toolbars, and contextual controls.

### Danger

Destructive actions must use the semantic danger system rather than the NEXCODE primary colour.

Destructive actions should never visually resemble normal confirmation actions.

---

## 20. Forms

Forms must prioritise clarity and predictable behaviour.

Every field should have an identifiable label.

Placeholder text must not replace labels.

Form states should include:

```text
Default
Hover
Focus
Filled
Disabled
Error
```

Where appropriate, components may additionally support:

```text
Success
Read-only
```

Errors should explain what needs to be corrected.

Do not rely solely on colour to communicate errors.

---

## 21. Focus States

Interactive elements must have clearly visible keyboard focus states.

The NEXCODE primary colour may be used as the main focus indicator.

Focus indicators must have sufficient contrast against surrounding surfaces.

Never remove browser focus visibility without providing an accessible replacement.

---

## 22. Tables

Tables are a major part of the admin interface and must prioritise readability.

Tables should provide clear distinction between:

* Header
* Rows
* Interactive rows
* Selected rows
* Hover state
* Empty state

Avoid unnecessary vertical separators.

Horizontal structure, spacing, alignment, and subtle row boundaries are usually sufficient.

Numeric values should be aligned consistently.

Actions should remain visually secondary to the data unless action is the primary purpose of the table.

---

## 23. Filters

Filtering interfaces should be predictable across features.

Common filter patterns should use shared visual behaviour.

Filters may include:

* Search
* Select controls
* Date ranges
* Status
* Boolean states
* Feature-specific filters

Active filters must be identifiable.

The interface should make it clear when the displayed dataset has been filtered.

---

## 24. Pagination

Pagination should be consistent across administrative lists.

Users should be able to understand:

* Current page
* Available navigation
* Whether previous or next pages exist

Where totals are available, relevant result information may also be displayed.

Pagination should not dominate the page visually.

---

## 25. Navigation

The primary navigation should make the current location immediately identifiable.

Active navigation should use the NEXCODE primary colour or another approved primary-state treatment.

Navigation must maintain sufficient contrast between:

```text
Default
Hover
Active
Disabled
```

Icons should support labels rather than replace understandable navigation labels without good reason.

---

## 26. Icons

Use icons consistently.

Icons should:

* Communicate a recognisable action or concept
* Use consistent sizing
* Align correctly with text
* Inherit semantic colour where appropriate

Do not add icons purely as decoration to every control.

Important actions should remain understandable without requiring the user to interpret an unfamiliar icon.

---

## 27. Status Indicators

Status information should use semantic design tokens.

Typical statuses include:

```text
Success
Warning
Error
Information
Neutral
```

Status should not be communicated through colour alone.

Use text, icons, labels, or another visual indicator alongside colour where necessary.

---

## 28. Empty States

Empty states must be intentionally designed.

They should explain:

1. What is empty
2. Why it may be empty when useful
3. What the user can do next when an action exists

Do not leave large blank areas with no explanation.

---

## 29. Loading States

Loading behaviour should preserve layout stability.

Prefer skeleton interfaces for content-heavy areas.

Use compact loading indicators for short actions where skeletons would not make sense.

Avoid large generic spinners replacing an entire page when a more contextual loading state can be provided.

---

## 30. Error States

Errors should be clear and actionable.

User-facing errors must not expose:

* Stack traces
* Internal backend URLs
* Database information
* Internal exception names
* Authentication tokens
* Sensitive implementation details

Error-page-specific behaviour is defined further in:

```text
.agents/error-pages.md
```

---

## 31. Dialogs and Modals

Dialogs should be used when the user must complete or acknowledge a focused task without leaving the current context.

Dialogs should include:

* Clear title
* Concise explanation
* Obvious primary action
* Obvious cancellation/close path

Destructive confirmation dialogs must explicitly describe the action being confirmed.

Avoid unnecessary modal workflows when a normal page or inline interaction would be clearer.

---

## 32. Dropdowns and Popovers

Dropdowns and popovers must visually appear above their parent surface.

They should use:

* Elevated surface tokens
* Appropriate border
* Restrained shadow
* Clear hover and selected states

They must remain keyboard accessible.

---

## 33. Motion

Motion should support understanding rather than decoration.

Appropriate uses include:

* Menu transitions
* Dialog appearance
* Dropdown appearance
* State changes
* Small feedback interactions

Animations should generally use:

```text
opacity
transform
```

Avoid animations that cause unnecessary layout work.

Motion should be short and subtle.

The application must respect:

```css
prefers-reduced-motion
```

---

## 34. Gradients

Decorative gradients should not be part of the default admin visual language.

Use flat surfaces and controlled contrast.

A gradient should only be introduced when there is a specific design requirement and it does not conflict with the professional administrative interface.

---

## 35. Accessibility

Accessibility is part of the design system, not an optional enhancement.

Interfaces must consider:

* Colour contrast
* Keyboard navigation
* Visible focus
* Semantic structure
* Form labels
* Error identification
* Reduced motion
* Screen-reader context
* Appropriate target sizes

Colour must never be the only way important information is communicated.

---

## 36. Interaction Feedback

Every interactive element should provide appropriate feedback.

Depending on the component, this may include:

```text
Hover
Focus
Active
Selected
Loading
Success
Error
Disabled
```

Users should not have to guess whether an action has started or completed.

---

## 37. Disabled States

Disabled controls must look disabled while remaining readable.

Avoid reducing opacity so aggressively that content becomes inaccessible.

Disabled states must not rely exclusively on cursor changes.

---

## 38. Destructive Actions

Destructive operations require special treatment.

Examples include:

* Delete
* Revoke
* Disable
* Remove
* Permanently reject

Use the semantic danger colour system.

Where consequences are significant or irreversible, require explicit confirmation.

Never use the primary green colour to communicate destructive intent.

---

## 39. Data Density

The admin interface should support efficient information consumption.

Do not make administrative interfaces unnecessarily spacious.

Dense content is acceptable when:

* Hierarchy remains clear
* Text remains readable
* Controls remain usable
* Rows remain distinguishable
* Accessibility is preserved

The goal is controlled density, not visual clutter.

---

## 40. Consistency

Existing design patterns should be reused before introducing new ones.

Before creating a new visual pattern, check whether the application already has an appropriate:

* Button
* Input
* Select
* Modal
* Table
* Badge
* Card
* Filter
* Pagination
* Empty state
* Loading state
* Error state

Similar problems should look and behave similarly.

---

## 41. Reusable Components

When the same visual or interaction pattern appears repeatedly, prefer a reusable component.

Reuse must not create overly generic components with unclear responsibilities.

Components should represent meaningful interface concepts.

Shared components must remain compatible with the design tokens defined by this system.

---

## 42. Design Tokens

Visual values shared across the application must be represented through design tokens.

The canonical token file is:

```text
src/styles/tokens.css
```

Token categories should include, where appropriate:

```text
Brand colours
Surface colours
Text colours
Border colours
Semantic colours

Font families
Font sizes
Font weights
Line heights

Spacing
Border radius
Shadows

Transitions
Layout dimensions
Z-index levels
```

Tokens should use meaningful semantic names.

Prefer:

```css
var(--color-text-secondary)
```

over names tied directly to raw values such as:

```css
var(--grey-a4)
```

Primitive tokens may exist internally when useful, but components should generally consume semantic tokens.

---

## 43. Raw Design Values

Raw colours, repeated spacing values, shadows, and other shared visual values should not be scattered throughout component stylesheets.

If a value represents part of the shared visual language, define it as a token.

A one-off value may be acceptable when it is genuinely unique to a component and has no design-system meaning.

Do not create tokens merely to avoid every literal number.

Tokens should represent reusable design decisions.

---

## 44. Global vs Component Design

Global design establishes:

* Brand
* Typography
* Colour system
* Spacing system
* Accessibility defaults
* Surface hierarchy
* Shared interaction language

Individual components determine how those rules are applied to their specific purpose.

A component may introduce its own layout but must not silently create a competing design system.

---

## 45. Marketing Site vs Admin Application

The NEXCODE Django/public website is the source of the brand identity, not a layout template for the admin application.

Carry forward:

* Primary green
* Dark visual identity
* Outfit typography
* Brand personality
* Selected display typography where appropriate

Do not automatically carry forward:

* Oversized marketing typography
* Decorative layouts
* Heavy animation
* Promotional page composition
* Decorative script typography
* Marketing-specific interactions

The admin application should feel unmistakably related to NEXCODE while remaining purpose-built for administration.

---

## 46. Source of Truth

For visual decisions, use the following hierarchy:

```text
1. This design.md
2. Shared design tokens
3. Existing approved shared components
4. Feature-specific design rules
5. Individual component requirements
```

For technical CSS implementation, follow:

```text
.agents/styling.md
```

For feature-specific requirements, also follow the applicable rule file such as:

```text
.agents/audit-logs.md
.agents/error-pages.md
```

Security, architecture, and API rules always remain applicable where relevant.

---

## 47. New UI Checklist

Before considering a new interface complete, verify:

* It follows the NEXCODE dark visual identity.
* `#D0FF71` is used intentionally rather than excessively.
* Outfit is the primary functional typeface.
* Six Caps is limited to appropriate display use.
* Sacramento is limited to exceptional decorative use.
* Prompt has not been inherited from the legacy Jazzmin theme.
* Information hierarchy is immediately understandable.
* Shared components are reused where appropriate.
* Shared visual values come from design tokens.
* Interactive states are defined.
* Keyboard focus is visible.
* Colour is not the only indicator of meaning.
* Empty states are designed.
* Loading states are designed.
* Error states are designed.
* Responsive behaviour is considered.
* Reduced-motion preferences are respected.
* Destructive actions are clearly differentiated.
* The interface remains practical for data-heavy administrative work.

---

## 48. Core Principle

The NEXCODE Admin design system should make the interface feel like one coherent product.

Every screen should favour:

**clarity, consistency, efficiency, accessibility, and deliberate use of the NEXCODE identity.**

When visual decoration conflicts with administrative usability, usability wins.
