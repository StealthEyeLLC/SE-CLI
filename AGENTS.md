# AGENTS.md

This file is the root instruction surface for any AI assistant, coding agent, local worker, or future automated tool operating in this repository.

## Repository identity

Repository: `StealthEyeLLC/SE-CLI`

SE-CLI is the StealthEye command/control spine for ChatGPT-operated build missions.

Canonical doctrine:

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

## Required reading order

Before planning or changing files, read:

1. `ops/OPERATOR_MANUAL.md`
2. `ops/HANDOFF.md`
3. `ops/STATUS.md`
4. `ops/BUILD_PLAN.md`
5. `ops/UPGRADE_LIST.md`
6. `ops/RECEIPT.md`
7. `ops/DECISIONS.md`
8. `docs/SECURITY.md`

Do not rely on prior chat context as authoritative state.

## Current status

The repository currently has:

- operating documentation spine
- living build plan
- bootstrap Dockerfile
- live Render bootstrap service

The repository does not yet have:

- real MCP runtime
- local worker
- work packet implementation
- CI
- Postgres migrations
- production `render.yaml`

## Operating rules

1. Keep the user-facing workflow inside ChatGPT/natural language.
2. Use mission-level planning and approval.
3. Prefer coherent implementation missions over tiny scattered edits.
4. Update operational docs when state changes.
5. Keep root clean; do not create a document forest.
6. Put operational state in `ops/`.
7. Put architecture/setup/security docs in `docs/`.
8. Do not add tool-specific adapter files unless explicitly approved.
9. Do not introduce local model dependencies.
10. Do not add dashboards before the core mission loop works.

## Safety rules

Forbidden without explicit elevated approval:

- generic remote shell tools
- unbounded command execution
- direct protected-branch mutation
- secrets, tokens, or credentials in files/prompts/logs/receipts
- workflow edits under `.github/workflows/**`
- root `render.yaml` production Blueprint
- license changes
- production deploy changes
- destructive deletion
- billing/payment changes
- external publication

Normal missions may create/edit allowlisted repo files, run listed validation commands, update docs, and prepare branch/PR work once the worker path exists.

## Documentation update rule

If a change affects build order, scope, or acceptance criteria, update `ops/BUILD_PLAN.md`.

If a change affects current state, update `ops/STATUS.md`.

If a change affects new-tab continuation, update `ops/HANDOFF.md`.

If a change completes a meaningful action, update `ops/RECEIPT.md`.

If a change affects next priorities, update `ops/UPGRADE_LIST.md`.

If a change records a durable architecture/product decision, update `ops/DECISIONS.md`.

## Build plan authority

`ops/BUILD_PLAN.md` is the living implementation plan. Use it to decide the next coherent build mission.

Current next mission at the time this file was added:

**P1/U001 - Create repository/package scaffold.**

## Branch and PR policy

During bootstrap, small documentation updates may land directly on `main`.

After the worker/packet/PR path exists, serious work should use mission branches and PRs.

Do not push directly to protected `main` once branch protection/CI exists.

## Worker doctrine

Workers are not planning agents. Workers are deterministic execution appliances.

Lifecycle:

**lease -> verify -> apply -> test -> commit -> push -> report**

Workers must not invent commands, widen authority, access secrets, or choose product direction.

## Output expectations

When reporting work, include:

- files changed
- commit or PR if available
- validation/proof performed
- current State Card change
- next safest action
- any blocker or required approval

Keep reports concise and factual.
