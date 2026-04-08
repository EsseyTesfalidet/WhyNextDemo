# Why Next.js Demo

A teaching lab that compares React-style client rendering with Next.js server-first rendering, then demonstrates core App Router routing patterns.

## What This Project Teaches

- React mode: heavy client-side fetch + render work.
- Next.js mode: server-prepared rendering with Suspense.
- Routing concepts with live visualization:
  - Nested dynamic routes (`/products/[category]/[id]`)
  - Optional catch-all routes (`/docs/[[...slug]]`)
  - Static generation with dynamic segment (`/terms/[slug]` with `generateStaticParams`)

## Current Demo Structure

### Home (`/`)

- Shows the React vs Next.js rendering comparison.
- Includes the comparison toggle (home only).
- React mode starts with a black loading window to clearly show client rendering progress.
- Next mode is fixed to full 6,000-tile render (no fast/slow switch).

### Teaching Routes

- `/products` -> nested dynamic routing demo entry
- `/products/[category]` -> category dynamic segment
- `/products/[category]/[id]` -> deeper nested dynamic segment
- `/docs` and `/docs/...` -> optional catch-all routing
- `/terms/tos` -> statically generated dynamic route example

### Blackboard (non-home routes)

A right-side live blackboard shows:

- active route file
- route pattern
- current URL
- route tree (highlighted)
- live route params

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Note: ESLint setup in this repo may prompt interactively if not configured yet.

## Presentation Flow (Suggested)

1. Start on `/` and show React vs Next mode.
2. Point out runtime evidence panels (request stream and dashboard).
3. Move to `/products`, `/docs`, and `/terms/tos`.
4. Use the blackboard route tree and params to explain URL -> route file -> params mapping.

## Project Notes

- Like button feature removed to keep teaching focus.
- Movie route/API removed to reduce unrelated demo noise.
- Next mode permanently renders full-detail mosaic for consistency during demos.
