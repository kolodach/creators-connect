# Architecture

Creators Connect is a Next.js App Router app with a Convex backend for data and realtime queries.

## High-level structure
- `app/` - Next.js App Router pages, layout, and providers.
- `app/ConvexClientProvider.tsx` - Initializes the Convex client for React.
- `convex/` - Convex query and mutation functions.
- `convex/_generated/` - Auto-generated Convex types and API bindings.
- `components/` and `lib/` - UI components and utilities.

## Current data flow
1. The client initializes the Convex React client using `NEXT_PUBLIC_CONVEX_URL` in `app/ConvexClientProvider.tsx`.
2. The homepage calls `useQuery(api.tasks.get)` in `app/page.tsx`.
3. The query resolves in `convex/tasks.ts` and returns documents from the `tasks` table.

## UI status
The current UI is a scaffold and renders task records from Convex. Product-specific UI and flows are still to be implemented.
