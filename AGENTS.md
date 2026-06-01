# AGENTS.md

This file is the root instruction surface for any AI assistant, coding agent, worker, or future automated tool operating in this repository.

## Repository identity

Repository: `StealthEyeLLC/SE-CLI`

SE-CLI is the StealthEye autonomy control plane for ChatGPT-operated build missions.

Canonical doctrine:

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

Canonical integrated spec:

`docs/INTEGRATED_SPEC.md`

## Required reading order

Before planning or changing files, read:

1. `docs/INTEGRATED_SPEC.md`
2. `ops/OPERATOR_MANUAL.md`
3. `ops/HANDOFF.md`
4. `ops/STATUS.md`
5. `ops/BUILD_PLAN.md`
6. `ops/UPGRADE_LIST.md`
7. `ops/RECEIPT.md`
8. `ops/DECISIONS.md`
9. `docs/SECURITY.md`

Do not rely on prior chat context as authoritative state.

## Current status

The repository currently has:

- canonical integrated spec
- operating documentation spine
- living build plan
- minimal TypeScript workspace
- Render-hosted read-only MCP runtime
- verified read-only MCP tools

The repository does not yet have:

- schema/policy core
- write-capable mission tools
- local worker
- work packet implementation
- CI
- Postgres migrations
- production `render.yaml`

## Operating model

1. ChatGPT is the natural-language commander, reviewer, repair commander, and summarizer.
2. The ChatGPT App/MCP connector is a thin bridge.
3. The SE-CLI server is the stateful control plane.
4. Build lists and missions are the units of scoped approval.
5. Work packets are the execution contracts.
6. Workers are deterministic execution appliances.
7. GitHub PRs are the review surface.
8. GitHub Actions is the proof surface.
9. Result packets return to ChatGPT instead of raw log dumps.
10. Durable server state is authoritative; ChatGPT memory is not.

## Operating rules

1. Keep the user-facing workflow inside ChatGPT/natural language.
2. Use mission-level or build-list-level planning and approval.
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
- credential values in files/prompts/logs/receipts
- workflow edits under `.github/workflows/**`
- root `render.yaml` production Blueprint
- license changes
- production deploy changes
- destructive deletion
- billing/payment changes
- external publication

Normal missions may create/edit allowlisted repo files, run listed validation commands, update docs, and prepare branch/PR work once the worker path exists.

## Documentation update rule

If a change affects canonical architecture or operating model, update `docs/INTEGRATED_SPEC.md` or `docs/ARCHITECTURE.md` as appropriate.

If a change affects build order, scope, or acceptance criteria, update `ops/BUILD_PLAN.md`.

If a change affects current state, update `ops/STATUS.md`.

If a change affects new-tab continuation, update `ops/HANDOFF.md`.

If a change completes a meaningful action, update `ops/RECEIPT.md`.

If a change affects next priorities, update `ops/UPGRADE_LIST.md`.

If a change records a durable architecture/product decision, update `ops/DECISIONS.md`.

## Build plan authority

`docs/INTEGRATED_SPEC.md` defines the target system.

`ops/BUILD_PLAN.md` defines the current implementation sequence.

Current next mission at the time this file was updated:

**P2A/U003 - Add app/server envelopes, build-list/mission/job/result schemas, authority classes, failure classes, and policy verdict fixtures.**

## Branch and PR policy

During initial bootstrap, small documentation updates may land directly on `main`.

After the worker/packet/PR path exists, serious work should use mission branches and PRs.

Do not push directly to protected `main` once branch protection/CI exists.

## Worker doctrine

Workers are not planning agents. Workers are deterministic execution appliances.

Lifecycle:

**lease -> verify -> apply -> test -> commit -> push -> report**

Workers must not invent commands, widen authority, access credentials, or choose product direction.

## Output expectations

When reporting work, include:

- files changed
- commit or PR if available
- verification/proof performed
- current State Card change
- next safest action
- any blocker or required approval

Keep reports concise and factual.
