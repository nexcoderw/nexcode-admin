# Performance

> Status: Mandatory
> Last reviewed: 2026-09-01

Staff use this portal all day. A slow table is not a cosmetic problem; it is
hours of someone's week.

## Budgets

| Measure | Target |
| --- | --- |
| Largest Contentful Paint | under 1.5s on desktop |
| Interaction to Next Paint | under 200ms |
| Cumulative Layout Shift | under 0.05 |
| First-load JavaScript per route | under 150KB gzipped |
| Table render, 100 rows | under 100ms |

## Ship Less JavaScript

- Server components by default. A component that only displays data has no
  reason to be a client component.
- `'use client'` goes as deep in the tree as possible. A page marked client
  sends the whole page to the browser.
- Heavy, rarely-used pieces — charts, editors, export dialogs — are loaded with
  `next/dynamic` so they are not in the initial bundle.
- No date, utility, or icon library imported wholesale for two functions.
  Import the function, or write it in `utils/`.
- Check the bundle before handover. A route that suddenly gains 100KB has a
  cause worth finding.

## Data

- Fetch in server components, in parallel. Sequential `await`s that do not
  depend on each other are a waterfall — use `Promise.all`.
- Fetch only what the screen renders. A list does not need the detail payload.
- Every list is paginated with the backend's cursor or offset support. Never
  fetch everything and paginate in the browser.
- Cache reference data — statuses, categories, currencies — with an explicit
  revalidation window. Never cache a response that varies by user without the
  user in the key.
- Never cache an authorization result.

## Rendering

- Long lists are virtualised beyond roughly 100 rows.
- Every list item has a stable `key` — never the array index, which makes React
  reuse the wrong row when the list reorders.
- Expensive derived values are computed once; the React Compiler handles most
  memoisation, so do not hand-write `useMemo` without a measured reason.
- Filters and search inputs are debounced before they cause a request.

## Layout Stability

- Images use `next/image` with explicit dimensions.
- The font is loaded through `next/font` with `display: swap`, which self-hosts
  it and reserves its metrics.
- Skeletons match the shape of the content they stand in for, so nothing jumps
  when data arrives.
- Never insert a banner above content already on screen.

## CSS

- CSS Modules are scoped and code-split per route by the framework — one more
  reason there is no global stylesheet beyond `globals.css`.
- Animate only `opacity` and `transform`. Anything else forces layout.
- No `@import` chains in CSS; they serialise loading.

## Measurement

- Measure before optimising, and again after. State the numbers in the handover.
- Test on a throttled connection and a mid-range device, not only a fast laptop.
- Run a production build before claiming a performance result — development
  builds tell you nothing about bundle size.

## Checklist

- [ ] New client components justified; boundary pushed as deep as possible.
- [ ] No sequential fetches that could run in parallel.
- [ ] Lists paginated server-side; long lists virtualised.
- [ ] Heavy components dynamically imported.
- [ ] Bundle size checked against the previous build.
- [ ] No layout shift when data replaces a skeleton.
