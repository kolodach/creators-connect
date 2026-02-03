# Convex Best Practices (Reference)

This reference consolidates Convex guidance on query performance, access control, validators, scheduling, and runtime usage. Use it when deciding how to refactor or validate a change.

## Await all Promises

### Why

Convex functions use async/await. Not awaiting promises (e.g., `ctx.scheduler.runAfter`, `ctx.db.patch`) can cause unexpected behavior or missed errors.

### How

Use the `@typescript-eslint/no-floating-promises` rule to enforce awaits.

## Avoid `.filter` on database queries

### Why

Filtering in code is often as good as `.filter` and easier to read. Conditions in `.withIndex` or `.withSearchIndex` are more efficient than `.filter` or filtering in code. Most `.filter` uses should become an index condition or a post-collect filter.

### How

Search for `.filter` in Convex code. Prefer `.withIndex` / `.withSearchIndex` for large result sets. If result sets are small, consider in-code filtering for readability.

### Exceptions

`.filter` on `paginate` can be appropriate to maintain page size. `withIndex` on paginated queries is still more efficient.

## Only use `.collect` with a small number of results

### Why

All results count towards bandwidth and can re-run on changes. If result sets are large (1000+ or unbounded), use an index, pagination, denormalization, or a limit.

### How

Audit `.collect` usage. If result size can grow large, refactor to `paginate`, `take`, or denormalized aggregates.

### Exceptions

Large data processing (migrations, summaries) can be done via actions with batching.

## Check for redundant indexes

### Why

Indexes like `by_foo` and `by_foo_and_bar` are often redundant. Reducing indexes saves storage and write overhead.

### How

Review `schema.ts` and look for prefixes. Keep both only when you need ordering by the prefix index (e.g., `foo` then `_creationTime`).

## Use argument validators for all public functions

### Why

Public functions can be called by anyone; validators ensure runtime types match expectations and block unexpected data.

### How

Ensure all `query`, `mutation`, and `action` functions define `args` validators. For HTTP actions, validate request bodies (e.g., with Zod).

## Use access control for all public functions

### Why

Public functions can be called by anyone. Require `ctx.auth.getUserIdentity()` or use unguessable IDs for access control.

### How

Add auth checks and ensure data access is scoped to the current user/team. Prefer granular functions like `setTeamOwner` over `updateTeam`.

## Only schedule and `ctx.run*` internal functions

### Why

Public functions must be audited for abuse. Internal functions can be restricted to Convex-only calls.

### How

Ensure `ctx.runQuery`, `ctx.runMutation`, `ctx.runAction`, schedulers, and crons reference `internal.*` not `api.*`.

## Use helper functions to write shared code

### Why

Keep public functions thin; move logic into `convex/model` helpers. This improves reuse and makes refactors easier.

### How

Extract shared logic into helpers; keep `query`/`mutation`/`action` wrappers minimal.

## Use `runAction` only when using a different runtime

### Why

`runAction` adds overhead and an extra transaction. Use plain helper functions unless you need a different runtime (Node.js).

### How

Replace `runAction` with helper function calls when in the same runtime.

## Avoid sequential `ctx.runMutation` / `ctx.runQuery` calls from actions

### Why

Separate transactions can be inconsistent. Combine into a single internal function when you need consistent state.

### How

Refactor multiple sequential `run*` calls into one internal query or mutation.

### Exceptions

Multiple `run*` calls can be needed when doing external side effects or large batch work.

## Use `ctx.runQuery` and `ctx.runMutation` sparingly in queries and mutations

### Why

`run*` adds overhead. Use plain TypeScript helpers unless required for components or partial rollback.

### Exceptions

Components or partial rollback scenarios.

## Always include the table name when calling `ctx.db` functions

### Why

Explicit table names will be required for custom ID generation and add safeguards.

### How

Use `ctx.db.get("table", id)` and the same pattern for `patch`, `replace`, `delete`.

## Don’t use `Date.now()` in queries

### Why

Queries don’t re-run with time changes; using `Date.now()` can cause stale results and cache churn.

### How

Use scheduled updates to set coarse flags (e.g., `isReleased`) or pass time as an argument (rounded) from the client.
