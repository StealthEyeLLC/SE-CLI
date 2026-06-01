# Build Plan

This is the living implementation plan for SE-CLI. Update this file whenever build order, scope, acceptance criteria, or current phase changes.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.
Canonical no-API-charge addendum: `docs/NO_API_CHARGE_ARCHITECTURE.md`.

## Operating doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans, reviews, summarizes, and sends repair or continuation instructions. The thin ChatGPT App/MCP connector forwards mission-level intent. The SE-CLI control server owns state, build lists, missions, packets, policy, queueing, integrations, deterministic continuation, and result compression. Workers execute bounded packets. GitHub and CI prove results. Render hosts the always-on control plane.

## No-API-charge rule

SE-CLI must not require OpenAI API usage, token-metered model calls, paid background model agents, API-side reasoning controllers, or hidden billable model loops.

ChatGPT is the only reasoning model. The server may continue deterministic approved work, but novel reasoning or novel repair waits for ChatGPT through the user's existing ChatGPT experience.

Allowed continuation without model calls:

- watch worker leases
- watch CI/proof state
- retry configured flaky proof once or by rule
- requeue expired leases
- mark approved items complete after proof passes
- start the next approved build-list item when the next step is mechanical
- prepare compact result packets
- stop with `needs_chatgpt` or `needs_user` when reasoning or authority is required

## Current build state

- Current phase: P2A - Core envelopes, schemas, and policy verdict foundation
- Current mode: read-only MCP verified; integrated spec and no-API-charge rule locked; next mission should define contracts before write tools
- Repo: `StealthEyeLLC/SE-CLI`
- Render service: `se-cli-mcp`
- Render URL: `https://se-cli-mcp.onrender.com`
- Render service id: `srv-d8ehlvvavr4c738olbm0`
- Runtime status: real MCP runtime live and connected to ChatGPT
- Verified tools: `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, `se.read_latest_receipt`, `se.apply_single_file_update`
- Worker: not implemented yet
- CI: not configured yet
- Database/queue: not configured yet

## Build principles

1. Build big coherent drops, not tiny toy slices.
2. Keep the user-facing UX inside ChatGPT.
3. Prefer mission/build-list approval over per-file or per-command approvals.
4. Keep the ChatGPT app thin.
5. Put serious state and execution coordination in the SE-CLI server.
6. Add contracts and policy gates before broad write/execution tools.
7. Add work packets before workers execute repo changes.
8. Keep workers deterministic: lease, verify, prepare, apply, validate, commit, push, report.
9. Use GitHub PRs as review surface and CI as proof surface.
10. Return structured result packets to ChatGPT, not raw log dumps.
11. Do not expose generic command execution as a ChatGPT-facing tool.
12. Do not add API-side model reasoning or hidden paid background agents.
13. Update operating docs when build state changes.

## Milestone map

| Phase | Name | Status | Purpose |
|---|---|---|---|
| P0 | Bootstrap and operating spine | complete | Establish docs, Render bootstrap, AGENTS.md, and living build plan |
| P1A | Render-first real MCP vertical slice | complete | Replace bootstrap placeholder with real read-only MCP runtime |
| P1B | Read-only MCP operating tools | complete | Verify State Card and operating-doc read tools through ChatGPT |
| P1C | Temporary constrained bootstrap writer | complete | Add single-file GitHub create/update lane for faster bootstrap while packet system is absent |
| P2A | Envelopes, schemas, and policy verdict foundation | next | Define contracts for thin-app autonomy and no-API-charge deterministic continuation |
| P2B | Build-list engine skeleton | planned | Represent approved build lists as executable project structure |
| P2C | Mission and async job controller skeleton | planned | Create resumable mission/job state with idempotent starts |
| P2D | Deterministic continuation controller skeleton | planned | Advance mechanical approved states without model calls |
| P3 | Packet builder without execution | planned | Create, validate, hash, and store work packets |
| P4 | Worker fixture execution | planned | Lease and execute safe fixture packets locally |
| P5 | GitHub branch/PR integration | planned | Commit/push mission branches and open/update PRs |
| P6 | GitHub Actions proof and failure compression | planned | Watch CI, fetch relevant failure context, and return result packets |
| P7 | Continue/fix/build-list loop | planned | Support continue, fix it, pause, and build-the-list flows |
| P8 | Durable state and memory | planned | Add DB-backed missions, jobs, packets, events, memory, and leases |
| P9 | Render runtime hardening | planned | Add dependency readiness, auth hardening, diagnostics, and Blueprint when stable |
| P10 | Optional ChatGPT Task heartbeat lane | later | Use existing-plan ChatGPT Tasks only if available and not API-billed |
| P11 | Operational polish | later | Improve summaries, progress display, blocked-state UX, and first-run setup |

## P0 - Bootstrap and operating spine

Status: complete

Completed:

- README expanded with SE-CLI doctrine.
- Root `AGENTS.md` added.
- `docs/INTEGRATED_SPEC.md` added as canonical v1.0 spec.
- `docs/NO_API_CHARGE_ARCHITECTURE.md` added as canonical no-API-charge constraint addendum.
- Operating docs and setup docs added.
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
- Connector visibility workaround documented.

## P1C - Temporary constrained bootstrap writer

Status: complete

Goal: reduce GitHub connector friction while the proper packet/worker system is not ready.

Completed:

- `se.apply_single_file_update`.
- Creates or updates one allowed UTF-8 repository file through GitHub.
- No shell.
- No delete.
- No workflow edits.
- No `render.yaml`.
- No env/secret/token/key files.
- Verified by creating `ops/BOOTSTRAP_WRITE_TEST.md`.

This is a temporary bootstrap lane, not the final mission execution model.

## P2A - Envelopes, schemas, and policy verdict foundation

Status: next

Goal: define the core contracts for the thin-app, no-API-charge autonomy control plane before broad write-capable tools, packets, or workers exist.

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
- Define `ContinuationDecisionV0` with deterministic-only decisions.
- Define `ReasoningRequirementV0` for `none`, `chatgpt_required`, and `user_required`.
- Add fixtures for allowed, elevated, blocked, invalid, deterministic-continue, and needs-ChatGPT cases.
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
- Deterministic continuation fixture advances only mechanical approved states.
- Novel repair fixture returns `needs_chatgpt`, not an API-agent action.
- Boundary fixture returns `needs_user`.
- No broad write-capable MCP tools are added.
- No worker execution is added.
- No DB/queue requirement is added.
- No OpenAI API or paid model dependency is added.

Stop conditions:

- Any schema enables generic command execution as a normal ChatGPT-facing primitive.
- Any test treats unbounded operations as normal authority.
- Any design introduces API-side model continuation.
- Any contract implies hidden token-metered reasoning.
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
- no-model next-item selection rules

Acceptance criteria:

- Server can load a build-list fixture.
- Server can choose the next unblocked item by deterministic rules.
- Server can update item status.
- Server stops when the next decision requires ChatGPT or the user.

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

## P2D - Deterministic continuation controller skeleton

Status: planned

Goal: replace the removed API-side controller lane with deterministic continuation.

Scope:

- continuation decision function
- mechanical pass -> next approved item
- proof pending -> wait/watch
- known flake -> configured retry
- expired lease -> requeue/quarantine
- novel failure -> needs ChatGPT
- boundary -> needs user
- uncertainty -> pause

Acceptance criteria:

- No model calls.
- Mechanical fixtures advance.
- Novel repair fixture stops with `needs_chatgpt`.
- Boundary fixture stops with `needs_user`.
- Repeated calls are idempotent.

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

Acceptance criteria:

- Worker executes safe fixture.
- Worker rejects invalid path/command fixture.
- Worker reports schema-valid result.
- Worker does not require a local AI model.

## P5 - GitHub branch/PR integration

Status: planned

Goal: make packet output reviewable through GitHub.

Acceptance criteria:

- One safe packet creates or updates one mission branch and PR.
- PR body includes mission, scope, changed files, commands, proof, limitations, and next action.
- No direct push to protected `main`.

## P6 - GitHub Actions proof and failure compression

Status: planned

Goal: watch proof and return useful result packets.

Acceptance criteria:

- CI pass marks mission passed.
- CI failure returns compressed failure packet.
- ChatGPT can understand the failure without raw log dump.
- No API-side model call is made for failure interpretation.

## P7 - Continue/fix/build-list loop

Status: planned

Goal: make natural commands map to server continuation logic and ChatGPT-mediated repair.

Acceptance criteria:

- User can say continue.
- User can say fix it.
- System proceeds through list when deterministic continuation allows it.
- System stops for novel repair reasoning, real boundaries, blockers, or completion.

## P8 - Durable state and memory

Status: planned

Goal: add DB-backed durable runtime state.

Acceptance criteria:

- State survives Render restart.
- New ChatGPT tab can resume from server state.
- Stale leases can expire safely.

## P9 - Render runtime hardening

Status: planned

Goal: harden the hosted control plane.

## P10 - Optional ChatGPT Task heartbeat lane

Status: later

Goal: support non-API-billed status checks if available inside the user's current ChatGPT plan.

Stop condition: if Tasks are unavailable or unsuitable, fall back to manual resume mode.

## P11 - Operational polish

Status: later

Goal: make the system feel smooth and understandable.

## Immediate next mission: P2A/U003

Title: Add core envelopes, schemas, policy verdicts, and deterministic continuation contracts.

Class: normal mission.

Mission envelope:

- May create/edit `packages/se-schemas/**`.
- May create/edit `packages/se-policy/**`.
- May create/edit tests/fixtures.
- May update package/workspace scripts if needed.
- May update operating docs after implementation.
- May use the temporary `se.apply_single_file_update` lane for single-file bootstrap edits.
- May not add broad write-capable MCP tools.
- May not add worker execution.
- May not add production deployment changes.
- May not require DB/queue.
- May not introduce local model dependencies.
- May not introduce OpenAI API/model-call dependencies.

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
- no-API-charge constraints change
- a new mission supersedes the next mission

Do not use this file as a detailed log. Use `ops/RECEIPT.md` for the latest completed action and future durable DB events for detailed history.
