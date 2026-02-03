---
name: convex-db-best-practices
description: Convex database and backend best-practices for queries, indexes, validators, access control, scheduling, and performance. Use when working on Convex app/db code, such as "add/update query", "fix query/index", "db performance", "Convex mutation/query/action", or any Convex schema/query changes.
---

# Convex DB Best Practices

Follow this workflow when editing Convex database code.

## Quick Workflow

1. Identify the Convex surface area.
2. Audit for common anti-patterns using search patterns.
3. Apply fixes using the guidance below.
4. If unsure about a rule, read `references/convex-best-practices.md` for detailed rationale and examples.

## Identify Scope

- Scan `convex/` for the relevant files and functions.
- Confirm whether the change touches queries, mutations, actions, indexes, or scheduled functions.

## Audit Search Patterns

Use `rg` to find likely hotspots:

- `\.filter\(\(?q` for query filters
- `\.collect\(` for unbounded collects
- `ctx\.run(Query|Mutation|Action)` for run* usage
- `ctx\.scheduler` and `crons` for scheduling
- `query\(|mutation\(|action\(|internalQuery\(|internalMutation\(|httpAction\(` for validator/access control checks
- `ctx\.db\.(get|patch|replace|delete)\(` for explicit table name usage
- `Date\.now\(\)` for time in queries
- `api\.` usage inside `convex/` (should usually be `internal.`)

## Fix Guidance (Short)

- Prefer indexes (`withIndex` / `withSearchIndex`) over `.filter` or in-code filtering when result sets can be large.
- Avoid `.collect()` on potentially unbounded queries; use indexes, `paginate`, `take`, or denormalize.
- Ensure all public functions have argument validators and access control checks.
- Schedule and `ctx.run*` only `internal.*` functions.
- Replace `runAction` with plain helper functions unless crossing runtimes.
- Avoid sequential `ctx.runQuery` / `ctx.runMutation` calls that need consistency; combine into single internal function.
- Avoid `ctx.runQuery` / `ctx.runMutation` inside queries and mutations unless required (components or partial rollback).
- Always pass table name into `ctx.db.get/patch/replace/delete`.
- Avoid `Date.now()` inside queries; use scheduled flags or pass time as arg.

## Output Expectations

- Provide a concise list of findings with file paths and suggested fixes.
- Apply edits directly when requested; otherwise propose a patch.
- Note any assumptions or places where a tradeoff exists.
