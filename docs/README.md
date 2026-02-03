# Creators Connect Docs

Start here for the project overview, founder-facing product notes, and developer setup.

## Document map

- `docs/founder-overview.md` - Product vision, flow, monetization, and trust policies.
- `docs/evidence-spec.md` - The initial evidence rules per content type and platform.
- `docs/architecture.md` - High-level technical structure and data flow.
- `docs/deployment.md` - Convex deployment and release notes.

## Developer guide

This project is a Next.js App Router frontend with a Convex backend.

### Prerequisites

- Node.js 20 or newer.
- pnpm (recommended, matches the repository lockfile).

### Environment variables

Create or update `.env.local` in the project root with values for your Convex deployment.

```bash
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
```

### Local development

1. Install dependencies: `pnpm install`.
2. Start Convex in one terminal: `pnpm exec convex dev`.
3. Start Next.js in another terminal: `pnpm dev`.
4. Open `http://localhost:3000`.

### Common scripts

- `pnpm dev` - Start the Next.js dev server.
- `pnpm build` - Build the app for production.
- `pnpm start` - Start the production server after a build.
- `pnpm lint` - Run ESLint.

### Working with Convex

- Convex functions live in `convex/`.
- Generated types and API live in `convex/_generated/` and should not be edited by hand.
- The current UI example queries `api.tasks.get` from `app/page.tsx`.

### Data notes

- `sampleData.jsonl` contains placeholder task data and can be used for local seeding if needed.
