# Git Rules

> Status: Mandatory
> Scope: `app/admin` repository Git workflow
> Last reviewed: 2026-09-01

These rules apply to every commit instruction produced for this repository. They
are absolute and are not relaxed for small or urgent changes.

## The Git Root

This repository's `.git` directory lives at `app/admin`. Every path in a Git
command is relative to that root.

```bash
cd app/admin
```

## Path Rules

Paths start at the Git root — with `src`, `public`, `docs`, or a root filename.
Never with the workspace path.

Correct:

```bash
git add package.json
git add src/app/layout.tsx
git add src/components/shared/Button.module.css
git add docs/styling.md
```

Incorrect — never write these:

```bash
git add inotraV2/app/admin/src/app/layout.tsx
git add app/admin/src/app/layout.tsx
git -C app/admin add src/app/layout.tsx
```

## One File, One `git add`, One Commit

Every file gets its own `git add` and its own `git commit`. Files are never
grouped, never staged together, and never share a commit message.

A component and its stylesheet are **two files and two commits**, even though
they are written together.

Correct:

```bash
git add src/components/shared/Button.tsx
git commit -m "Add the shared button with its five interaction states"

git add src/components/shared/Button.module.css
git commit -m "Style the shared button from the design tokens"
```

Incorrect:

```bash
git add src/components/shared/Button.tsx src/components/shared/Button.module.css
git commit -m "Add button"

git add src/components/
git commit -m "Components"

git add .
git commit -m "Changes"
```

`git add .`, `git add -A`, `git add -u`, and directory-level `git add` are
forbidden without exception.

## Commit Message Rules

Each message describes only the one file it commits. Messages must:

- Be imperative and specific.
- Name the behaviour or responsibility that changed.
- Be distinct from every other message in the same handover.
- Avoid `fix`, `update`, `changes`, `work`, `wip`, `styles`, and bare filenames.

Preferred:

- `Add the administrator sign-in form with mirrored validation`
- `Proxy the sign-in request so the backend address stays server-side`
- `Add the not-found page with a route back to the dashboard`
- `Define the design tokens for colour, spacing, and breakpoints`

Rejected:

- `Update styles`
- `Button.tsx`
- `Fix layout`

## Delivery Format

Commit instructions are delivered as copy-and-paste blocks the user runs:

```bash
cd app/admin

git add src/app/(auth)/login/page.tsx
git commit -m "Add the administrator sign-in page"

git add src/app/(auth)/login/page.module.css
git commit -m "Style the sign-in page for desktop and small screens"
```

The block covers every file created or modified in that handover, in a sensible
order, with no file omitted.

## AI Execution Rules

An AI agent working in this repository must **never**:

- Run `git add`.
- Run `git commit`.
- Run `git push` — under any circumstance, including when explicitly asked.
- Run `git merge`, `git rebase`, `git reset`, `git revert`, `git checkout` on
  files with changes, `git clean`, or any history rewrite.
- Create tags, branches, or releases.

The agent produces the commands; the user runs them. `git status --short`,
`git diff`, and `git log` are the only Git commands an agent may run, and only
to inspect state.

An agent must never claim a commit exists. It states that the commands are ready
to run.

## Never Commit

- `.env`, `.env.local`, or any real environment file
- API keys, tokens, session values, or backend credentials
- `node_modules/`, `.next/`, `out/`, `coverage/`, logs, `.DS_Store`
- Screenshots or exports containing real customer data

`.env.example` is committed — structure and placeholders only. See
`environment.md`.

## Safety Rules

- Inspect `git status --short` before and after work.
- Never stage a file the user did not ask to change.
- Never revert or overwrite unrelated changes.
- If unrelated changes are already staged, warn the user before handing over
  commit commands.
