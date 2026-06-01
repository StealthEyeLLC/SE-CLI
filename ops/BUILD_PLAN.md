# Build Plan

This is the living implementation plan for SE-CLI. Update this file whenever build order, scope, acceptance criteria, or current phase changes.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.
Current control-plane upgrade note: `docs/MCP_CONTROL_PLANE_UPGRADES.md`.

## Operating doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans, reviews, summarizes, and sends repair or continuation instructions. The thin ChatGPT App/MCP connector forwards mission-level intent. The SE-CLI control server owns state, build lists, missions, packets, policy, queueing, deterministic continuation, integrations, and result compression. Workers execute bounded packets. GitHub and CI prove results. Render hosts the always-on control plane.

## Current build state

- Current phase: P2A - Core envelopes, schemas, policy verdicts, and continuation contracts
- Current mode: MCP control-plane architecture locked; bootstrap write lanes verified; next mission should define contracts before worker execution
- Repo: `StealthEyeLLC/SE-CLI`
- Render service: `se-cli-mcp`
- Render URL: `https://se-cli-mcp.onrender.com`
- Render service id: `srv-d8ehlvvavr4c738olbm0`
- Runtime status: real MCP runtime live and connected to ChatGPT
- Verified tools: `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, `se.read_latest_receipt`, `se.apply_single_file_update`, `se.apply_file_batch`
- Worker: not implemented yet
- CI: not configured yet
- Database/queue: not configured yet

## Build principles

1. Build coherent control-plane slices, not scattered toy edits.
2. Keep the user-facing UX inside ChatGPT.
3. Keep the ChatGPT app thin.
4. Put real state and execution coordination in the SE-CLI server.
5. Use mission/build-list approval rather than per-file or per-command approvals.
6. Add schemas and policy gates before broad execution tools.
7. Add work packets before workers execute repo changes.
8. Keep workers deterministic: lease, verify, prepare, apply, validate, commit, push, report.
9. Use GitHub PRs as review surface and CI as proof surface.
10. Return structured result packets to ChatGPT, not raw logs.
11. Do not expose generic command execution as a ChatGPT-facing tool.
12. Update operating docs when build state changes.

## Milestone map

| Phase | Name | Status | Purpose |
|---|---|---|---|
| P0 | Bootstrap and operating spine | complete | Establish docs, Render bootstrap, AGENTS.md, and living build plan |
| P1A | Render-first real MCP vertical slice | complete | Replace bootstrap placeholder with real read-only MCP runtime |
| P1B | Read-only MCP operating tools | complete | Verify State Card and operating-doc read tools through ChatGPT |
| P1C | Routine single-file update lane | complete | Add bounded one-file GitHub update lane while packet system is absent |
| P1D | Routine batch update lane | complete | Add bounded multi-file update lane for faster bootstrap edits |
| P2A | Envelopes, schemas, policy verdicts, and continuation contracts | next | Define contracts for thin-app to MCP control-plane autonomy |
| P2B | Build-list engine skeleton | planned | Represent approved build lists as executable project structure |
| P2C | Mission and async job controller skeleton | planned | Create resumable mission/job state with idempotent starts |
| P2D | Continuation controller skeleton | planned | Advance clear approved states and stop for review or boundaries |
| P3 | Packet builder without execution | planned | Create, validate, hash, and store work packets |
| P4 | Worker fixture execution | planned | Lease and execute safe fixture packets locally |
| P5 | GitHub branch/PR integration | planned | Commit/push mission branches and open/update PRs |
| P6 | GitHub Actions proof and failure compression | planned | Watch CI, fetch relevant failure context, and return result packets |
| P7 | Continue/fix/build-list loop | planned | Support continue, fix it, pause, and build-the-list flows |
| P8 | Durable state and memory | planned | Add DB-backed missions, jobs, packets, events, memory, and leases |
| P9 | Render runtime hardening | planned | Add dependency readiness, auth hardening, diagnostics, and Blueprint when stable |
| P10 | Heartbeat/check-in lane | later | Add optional scheduled state checks and summaries if useful |
| P11 | Operational polish | later | Improve summaries, progress display, blocked-state UX, and first-run setup |

## P1C - Routine single-file update lane

Status: complete

Completed:

- `se.apply_single_file_update`.
- Creates or updates one allowed UTF-8 repository file through GitHub.
- Keeps routine bootstrap edits inside SE-CLI.
- Verified by creating `ops/BOOTSTRAP_WRITE_TEST.md`.

This is a temporary bridge, not the final mission execution model.

## P1D - Routine batch update lane

Status: complete

Completed:

- `se.apply_file_batch`.
- Creates or updates a small set of allowed UTF-8 repository files through GitHub from one ChatGPT tool call.
- Verified by creating `ops/BATCH_WRITE_TEST_A.md` and `ops/BATCH_WRITE_TEST_B.md`.

This reduces tool-call friction while the full packet/worker system is being built.

## P2A - Envelopes, schemas, policy verdicts, and continuation contracts

Status: next

Goal: define the core contracts for the thin-app to MCP control-plane loop before packet/worker execution exists.

Scope:

- Add or expand `packages/se-schemas`.
- Add or expand `packages/se-policy`.
- Define `AppRequestEnvelopeV0`.
- Define `ServerResponseEnvelopeV0`.
- Define `BuildListV0`.
- Define `BuildListItemV0`.
- Define `MissionV0`.
- Define `AuthorityClassV0`.
- Define `WorkPacketV0` shell shape without execution.
- Define `JobV0`.
- Define `WorkerLeaseV0`.
- Define `WorkerCapabilityV0`.
- Define `ResultPacketV0`.
- Define `BoundaryRequestV0`.
- Define `PolicyVerdictV0`.
- Define `FailureClassV0`.
- Define `ContinuationDecisionV0`.
- Define `ReasoningRequirementV0` for none, ChatGPT review, and user decision.
- Add fixtures for allowed, elevated, blocked, invalid, clear continuation, needs-review, and needs-user cases.
- Add tests proving classification and validation behavior.

Acceptance criteria:

- `pnpm build` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- Schema fixtures validate deterministically.
- Allowed normal mission fixture passes.
- Elevated fixture is classified as requiring a boundary request.
- Invalid path/command/scope fixture fails.
- Result packet fixture supports tiny, standard, and artifact-pointer views.
- Clear continuation fixture advances only approved mechanical states.
- Novel repair fixture returns needs-review.
- Boundary fixture returns needs-user.
- No broad write-capable mission tools are added.
- No worker execution is added.
- No DB/queue requirement is added.

Stop conditions:

- Any schema enables generic command execution as a normal ChatGPT-facing primitive.
- Any test treats unbounded operations as normal authority.
- Any contract lets worker behavior invent commands or scope.

## Immediate next mission

Title: Add core envelopes, schemas, policy verdicts, and continuation contracts.

Class: normal mission.

Mission envelope:

- May create/edit `packages/se-schemas/**`.
- May create/edit `packages/se-policy/**`.
- May create/edit tests/fixtures.
- May update package/workspace scripts if needed.
- May update operating docs after implementation.
- May use the routine SE-CLI update lanes for bounded bootstrap edits.
- May not add broad mission execution tools.
- May not add worker execution.
- May not add production deployment changes.
- May not require DB/queue.
- May not introduce local model dependencies.

Acceptance tests:

- `pnpm install`
- `pnpm build`
- `pnpm typecheck`
- `pnpm test`

## Build-plan update rules

Update this file when:

- a phase starts
- a phase exits
- acceptance criteria change
- a new stop condition is discovered
- build order changes
- Render/GitHub/worker architecture changes
- a new mission supersedes the next mission

Do not use this file as a detailed log. Use `ops/RECEIPT.md` for the latest completed action and future durable DB events for detailed history.
