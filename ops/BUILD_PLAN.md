# Build Plan

This is the living implementation plan for SE-CLI. Update this file whenever build order, scope, acceptance criteria, or current phase changes.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.

## Operating doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans, reviews, summarizes, and sends repair or continuation instructions. The thin ChatGPT App/MCP connector forwards mission-level intent. The SE-CLI control server owns state, build lists, missions, packets, policy, queueing, integrations, and result compression. Workers execute bounded packets. GitHub and CI prove results. Render hosts the always-on control plane.

## Current build state

- Current phase: P2A - Core envelopes, schemas, and policy verdict foundation
- Current mode: read-only MCP verified; integrated spec locked; next mission should define contracts before write tools
- Repo: `StealthEyeLLC/SE-CLI`
- Render service: `se-cli-mcp`
- Render URL: `https://se-cli-mcp.onrender.com`
- Render service id: `srv-d8ehlvvavr4c738olbm0`
- Runtime status: real read-only MCP runtime live and connected to ChatGPT
- Verified tools: `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, `se.read_latest_receipt`
- Worker: not implemented yet
- CI: not configured yet
- Database/queue: not configured yet

## Build principles

1. Build big coherent drops, not tiny toy slices.
2. Keep the user-facing UX inside ChatGPT.
3. Prefer mission/build-list approval over per-file or per-command approvals.
4. Keep the ChatGPT app thin.
5. Put serious state and execution coordination in the SE-CLI server.
6. Add contracts and policy gates before write/execution tools.
7. Add work packets before workers execute repo changes.
8. Keep workers deterministic: lease, verify, prepare, apply, validate, commit, push, report.
9. Use GitHub PRs as review surface and CI as proof surface.
10. Return structured result packets to ChatGPT, not raw log dumps.
11. Do not expose generic command execution as a ChatGPT-facing tool.
12. Update `ops/STATUS.md`, `ops/HANDOFF.md`, `ops/RECEIPT.md`, `ops/UPGRADE_LIST.md`, and this file when build state changes.

## Milestone map

| Phase | Name | Status | Purpose |
|---|---|---|---|
| P0 | Bootstrap and operating spine | complete | Establish docs, Render bootstrap, AGENTS.md, and living build plan |
| P1A | Render-first real MCP vertical slice | complete | Replace bootstrap placeholder with real read-only MCP runtime |
| P1B | Read-only MCP operating tools | complete | Verify State Card and operating-doc read tools through ChatGPT |
| P2A | Envelopes, schemas, and policy verdict foundation | next | Define the contracts that make thin-app autonomy coherent |
| P2B | Build-list engine skeleton | planned | Represent approved build lists as executable project structure |
| P2C | Mission and async job controller skeleton | planned | Create resumable mission/job state with idempotent starts |
| P3 | Packet builder without execution | planned | Create, validate, hash, and store work packets |
| P4 | Worker fixture execution | planned | Lease and execute safe fixture packets locally |
| P5 | GitHub branch/PR integration | planned | Commit/push mission branches and open/update PRs |
| P6 | GitHub Actions proof and failure compression | planned | Watch CI, fetch relevant failure context, and return result packets |
| P7 | Continue/fix/build-list loop | planned | Support continue, fix it, pause, and build-the-list flows |
| P8 | Durable state and memory | planned | Add DB-backed missions, jobs, packets, events, memory, and leases |
| P9 | Render runtime hardening | planned | Add dependency readiness, auth hardening, diagnostics, and Blueprint when stable |
| P10 | Heartbeat/API continuation lane | later | Add scheduled/API continuation without relying on magical tab callbacks |
| P11 | Operational polish | later | Improve summaries, progress display, blocked-state UX, and first-run setup |

## P0 - Bootstrap and operating spine

Status: complete

Completed:

- README expanded with SE-CLI doctrine.
- Root `AGENTS.md` added.
- `docs/INTEGRATED_SPEC.md` added as canonical v1.0 spec.
- `ops/OPERATOR_MANUAL.md`, `ops/HANDOFF.md`, `ops/STATUS.md`, `ops/BUILD_PLAN.md`, `ops/UPGRADE_LIST.md`, `ops/RECEIPT.md`, `ops/DECISIONS.md`, and `ops/RUNBOOK.md` added.
- `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/RENDER_SETUP.md`, `docs/CHATGPT_APP_SETUP.md`, `docs/LICENSING.md`, and `docs/render-blueprint.example.yaml` added.
- Root `Dockerfile` and `.dockerignore` added.

## P1A - Render-first real MCP vertical slice

Status: complete

Completed:

- Minimal TypeScript workspace.
- `apps/mcp-server` real app.
- `packages/se-core` State Card model.
- `/healthz`, `/readyz`, `/status`, and `/mcp`.
- Dockerfile builds and starts the real MCP runtime.
- Render deploy verified.
- `se.get_state_card` verified through ChatGPT.

## P1B - Read-only MCP operating tools

Status: complete

Completed:

- `se.read_handoff`.
- `se.read_build_plan`.
- `se.read_upgrade_list`.
- `se.read_latest_receipt`.
- Docker runtime image includes `ops/` so docs can be read from Render.
- Connector visibility workaround documented: if SE-CLI disappears while GitHub is enabled, expose SE-CLI only and retry.

## P2A - Envelopes, schemas, and policy verdict foundation

Status: next

Goal: define the core contracts for the thin-app autonomy control plane before any write-capable tools, packets, or workers exist.

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
- Add fixtures for allowed, elevated, blocked, and invalid mission shapes.
- Add tests proving classification and validation behavior.

Acceptance criteria:

- `pnpm build` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- Schema fixtures validate deterministically.
- Allowed normal mission fixture passes.
- Elevated fixture is classified as requiring explicit boundary approval.
- Invalid path/command/scope fixture fails.
- Result packet fixture supports tiny, standard, and artifact-pointer views.
- No write-capable MCP tools are added.
- No worker execution is added.
- No DB/queue requirement is added.

Stop conditions:

- Any schema enables generic command execution as a normal ChatGPT-facing primitive.
- Any test treats unbounded operations as normal authority.
- Contracts are vague enough that worker behavior could invent commands or scope.

## P2B - Build-list engine skeleton

Status: planned

Goal: make approved build lists executable structure.

Scope:

- build-list storage abstraction, initially in-memory/static or fixture-backed
- dependency tracking
- item status transitions
- next unblocked item selection
- progress counters
- pause/resume/skip/cancel states

Acceptance criteria:

- Server can load a build-list fixture.
- Server can choose the next unblocked item.
- Server can update item status.
- ChatGPT can ask what is next through a read/status tool once wired.

## P2C - Mission and async job controller skeleton

Status: planned

Goal: make long operations resumable and idempotent before real execution.

Scope:

- mission creation
- job creation
- idempotency keys
- state machine constants
- queue state shell
- result packet shell
- status read behavior

Acceptance criteria:

- Starting a mission returns a mission ID and job ID.
- Repeating the same idempotency key returns the existing mission/job.
- Mission/job status can be reconstructed.
- No worker dispatch is required yet.

## P3 - Packet builder without execution

Status: planned

Goal: create work packets but do not run them yet.

Scope:

- packet builder
- packet validator
- packet hashing
- expected file hashes
- allowed paths
- allowed commands
- validation plan
- packet artifact layout
- packet preview summary

Acceptance criteria:

- Valid fixture packet is created and hashed.
- Invalid packet is rejected.
- Duplicate idempotency behaves deterministically.
- Packet cannot contain generic unbounded commands.

## P4 - Worker fixture execution

Status: planned

Goal: prove a local worker can execute safe fixture packets.

Scope:

- worker registration fixture
- heartbeat shell
- job lease shell
- packet download/read
- hash verify
- policy verify
- fixture apply
- validation command
- structured worker result

Acceptance criteria:

- Worker executes safe fixture.
- Worker rejects invalid path/command fixture.
- Worker reports schema-valid result.
- Worker does not require a local AI model.

## P5 - GitHub branch/PR integration

Status: planned

Goal: make packet output reviewable through GitHub.

Scope:

- branch creation
- commit generation
- push mission branch
- open/update PR
- PR body template
- changed-file summary
- mission-to-PR linkage

Acceptance criteria:

- One safe packet creates or updates one mission branch and PR.
- PR body includes mission, scope, changed files, commands, proof, limitations, and next action.
- No direct push to protected `main`.

## P6 - GitHub Actions proof and failure compression

Status: planned

Goal: watch proof and return useful result packets.

Scope:

- CI run detection
- CI status watch
- failed log fetch
- failure classification
- allowed rerun handling
- result packet compression

Acceptance criteria:

- CI pass marks mission passed.
- CI failure returns compressed failure packet.
- ChatGPT can understand the failure without raw log dump.

## P7 - Continue/fix/build-list loop

Status: planned

Goal: make natural commands map to server continuation logic.

Scope:

- `se.continue`
- `se.submit_fix`
- auto-repair eligibility
- next-item continuation
- stop-at-boundary behavior
- build-list completion summary

Acceptance criteria:

- User can say continue.
- User can say fix it.
- System proceeds through list when allowed.
- System stops only for real boundaries, blockers, or completion.

## P8 - Durable state and memory

Status: planned

Goal: add DB-backed durable runtime state.

Scope:

- migrations
- build lists
- missions
- jobs
- packets
- events
- receipts
- handoffs
- result packets
- boundary requests
- worker leases
- memory items

Acceptance criteria:

- State survives Render restart.
- New ChatGPT tab can resume from server state.
- Stale leases can expire safely.

## P9 - Render runtime hardening

Status: planned

Goal: harden the hosted control plane.

Scope:

- configured dependency readiness
- auth hardening
- connector diagnostics
- runtime version reporting
- Render status adapter
- production `render.yaml` in an elevated mission when stable

## P10 - Heartbeat/API continuation lane

Status: later

Goal: support continuation without relying on same-tab callbacks.

Scope:

- status polling
- scheduled heartbeat prompt
- optional API controller lane
- server-side continuation mode flag

## P11 - Operational polish

Status: later

Goal: make the system feel smooth and understandable.

Scope:

- better result summaries
- better progress display
- better blocked-state messages
- better connector diagnostics
- better failure mapping
- better first-run setup
- better what-happened/what-next summaries

## Immediate next mission: P2A/U003

Title: Add core envelopes, schemas, and policy verdict foundation.

Class: normal mission.

Mission envelope:

- May create/edit `packages/se-schemas/**`.
- May create/edit `packages/se-policy/**`.
- May create/edit tests/fixtures.
- May update package/workspace scripts if needed.
- May update operating docs after implementation.
- May not add write-capable MCP tools.
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
