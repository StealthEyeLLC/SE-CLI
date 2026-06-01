# Build Plan

This is the living implementation plan for SE-CLI. Update this file whenever build order, scope, acceptance criteria, or current phase changes.

## Operating doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans and reports. The MCP control plane owns state, memory, policy, packets, GitHub/Render integration, and handoff. Workers execute bounded packets. GitHub Actions proves results. Render hosts the MCP/control plane.

## Current build state

- Current phase: P1A - Render-first real MCP vertical slice
- Current mode: bootstrap verified; next mission should replace the placeholder with a real read-only MCP app
- Repo: `StealthEyeLLC/SE-CLI`
- Render service: `se-cli-mcp`
- Render URL: `https://se-cli-mcp.onrender.com`
- Render service id: `srv-d8ehlvvavr4c738olbm0`
- Bootstrap endpoints verified by user: `/healthz`, `/readyz`, `/status`
- Runtime status: bootstrap placeholder service only
- Real MCP runtime: next
- Local worker: not implemented yet
- CI: not configured yet
- Database/queue: not configured yet

## Plan correction

The first build plan was too scaffold-first. That was safe, but it delayed the highest-value path: getting a real Render-hosted MCP app connected quickly.

The corrected plan is Render-first:

1. Keep the existing Render bootstrap working.
2. Add only the TypeScript scaffold needed for the MCP server.
3. Replace the placeholder `/mcp` response with a real MCP runtime.
4. Add read-only tools first.
5. Connect ChatGPT to the real MCP endpoint.
6. Then build packets, workers, GitHub PR automation, CI, and durable memory.

The goal is not a perfect monorepo before the app. The goal is a working Render MCP control plane as early as possible.

## Build principles

1. Build big coherent drops, not tiny toy slices.
2. Keep the user-facing UX inside ChatGPT.
3. Prefer one mission-level approval over per-file or per-command approvals.
4. Make Render useful early by replacing the bootstrap server with a real read-only MCP runtime.
5. Add work packets before any write/execution tools.
6. Keep workers deterministic: lease, verify, apply, test, commit, push, report.
7. Use GitHub Actions as proof before treating serious work as complete.
8. Keep Render as the always-on control plane, not the heavy build machine.
9. Do not expose generic shell execution as a ChatGPT-facing tool.
10. Update `ops/STATUS.md`, `ops/HANDOFF.md`, `ops/RECEIPT.md`, `ops/UPGRADE_LIST.md`, and this file when build state changes.
11. Do not widen deploy, workflow, credential, or destructive authority without elevated approval.

## Milestone map

| Phase | Name | Status | Purpose |
|---|---|---|---|
| P0 | Bootstrap and operating spine | complete | Establish docs, Render bootstrap, AGENTS.md, and living build plan |
| P1A | Render-first real MCP vertical slice | next | Replace bootstrap placeholder with real TypeScript MCP app and read-only State Card tool |
| P1B | Focused repo/package scaffold | planned | Expand monorepo packages only as needed by the working app |
| P2 | Schemas and policy core | planned | Define mission, packet, state card, receipt, handoff, and policy schemas |
| P3 | MCP read tools complete | planned | Add handoff, receipt, upgrade list, build plan, and mission inspection tools |
| P4 | Packet creation without execution | planned | Create, validate, hash, and store work packets |
| P5 | Local worker fixture execution | planned | Lease and execute safe fixture packets locally |
| P6 | GitHub branch/PR integration | planned | Commit/push mission branches and open/update PRs |
| P7 | GitHub Actions proof | planned | Add CI and proof gates for repo/build/packet checks |
| P8 | Durable state and memory | planned | Add Postgres migrations and durable mission/job/memory storage |
| P9 | Full Render runtime hardening | planned | Add DB/queue readiness, auth hardening, and production Blueprint |
| P10 | Golden path mission loop | planned | One approval -> packet -> worker -> PR -> proof -> handoff |
| P11 | Hardening and recovery | planned | Retry, quarantine, failure memory, elevated mission handling |
| P12 | Research mode and optional surfaces | later | Add extended research receipts and optional status widget/visual fallback |

## P0 - Bootstrap and operating spine

Status: complete

Goal: make the repo understandable, deployable as a bootstrap service, and ready for implementation missions.

Completed:

- README expanded with SE-CLI doctrine.
- Root `AGENTS.md` added.
- `ops/OPERATOR_MANUAL.md` added.
- `ops/HANDOFF.md` added.
- `ops/STATUS.md` added.
- `ops/BUILD_PLAN.md` added.
- `ops/UPGRADE_LIST.md` added.
- `ops/RECEIPT.md` added.
- `ops/DECISIONS.md` added.
- `ops/RUNBOOK.md` added.
- `docs/ARCHITECTURE.md` added.
- `docs/SECURITY.md` added.
- `docs/RENDER_SETUP.md` added.
- `docs/CHATGPT_APP_SETUP.md` added.
- `docs/LICENSING.md` added.
- `docs/render-blueprint.example.yaml` added.
- Root `Dockerfile` added for Render bootstrap.
- `.dockerignore` added.
- Render Docker service live and browser-verified.

Exit condition: complete.

## P1A - Render-first real MCP vertical slice

Status: next

Goal: replace the bootstrap placeholder with a real TypeScript MCP runtime on Render as fast as possible, while keeping the scope read-only and safe.

This phase intentionally does not build the whole monorepo. It adds only the minimum scaffold needed for a real app.

Scope:

- Root `package.json`.
- `pnpm-workspace.yaml`.
- `tsconfig.base.json`.
- `apps/mcp-server/` minimal TypeScript app.
- Minimal `packages/se-core/` for shared State Card data/types.
- Minimal `packages/se-schemas/` if needed for State Card validation.
- Minimal test setup.
- Dockerfile updated to build/start the real MCP app.
- `/healthz` endpoint retained.
- `/readyz` endpoint retained.
- `/status` endpoint returns real app State Card.
- `/mcp` endpoint becomes real MCP endpoint, not placeholder.
- First read-only MCP tool: `se.get_state_card`.
- No write tools.
- No worker.
- No DB requirement.
- No queue requirement.

Acceptance criteria:

- `pnpm install` works.
- `pnpm build` works.
- `pnpm typecheck` works.
- `pnpm test` works, even if the initial test set is small.
- Docker image builds.
- Render deploys successfully.
- `/healthz` returns healthy.
- `/readyz` returns readiness without requiring DB/queue.
- `/status` returns the real app State Card.
- `/mcp` supports initialize/list-tools for the read-only MCP runtime.
- `se.get_state_card` is available as a read-only tool.
- Bootstrap fallback is not deleted until the real runtime is verified.
- Operational docs updated.

Stop conditions:

- Render deploy breaks without rollback path.
- `/healthz`, `/readyz`, or `/status` regress.
- `/mcp` becomes a write-capable surface before read-only tools are verified.
- The app requires DB/queue before those services are wired.
- Any credential value enters repo files.

## P1B - Focused repo/package scaffold

Status: planned

Goal: expand the monorepo only after the real MCP app is live.

Scope:

- `apps/worker/` skeleton.
- `apps/status-widget/` placeholder only if needed.
- `packages/se-policy/`.
- `packages/se-memory/`.
- `packages/se-packets/`.
- `packages/se-receipts/`.
- `packages/se-github/`.
- `packages/se-render/`.
- `packages/se-worker-protocol/`.
- `packages/se-cli/`.
- `tests/fixtures/`.

Acceptance criteria:

- Existing Render MCP app still deploys.
- Package boundaries are useful, not decorative.
- Base scripts still pass.

Stop conditions:

- Package expansion delays the working Render app.
- App code is split across packages before it is useful.

## P2 - Schemas and policy core

Status: planned

Goal: define execution contracts before write/execution tools exist.

Scope:

- State Card schema.
- Mission schema.
- Job schema.
- Work packet schema.
- Receipt schema.
- Handoff schema.
- Upgrade item schema.
- Worker heartbeat schema.
- Normal/elevated/hard-stop approval class schema.
- Path allowlist policy.
- Command allowlist policy.
- Risk scoring helper.

Acceptance criteria:

- Safe mission fixture passes.
- Unsafe path fixture fails.
- Unsafe command fixture fails.
- Credential-like fixture fails.
- Workflow-edit fixture requires elevated approval.
- Production deploy fixture requires elevated approval.

Stop conditions:

- Policy permits generic shell execution.
- Policy allows protected branch mutation in normal missions.
- Schema contracts are vague or undocumented.

## P3 - MCP read tools complete

Status: planned

Goal: make ChatGPT able to inspect repo operating state through MCP before any write tools exist.

Scope:

- `se.get_state_card`.
- `se.read_handoff`.
- `se.read_build_plan`.
- `se.read_upgrade_list`.
- `se.read_latest_receipt`.
- `se.inspect_mission`, initially backed by docs/static state.
- Tool metadata and read-only annotations.

Acceptance criteria:

- ChatGPT app can list tools.
- Read tools return structured data.
- No write tools are exposed.
- Tool names are clear and not overly broad.

Stop conditions:

- Auth complexity blocks read-only testing.
- Read tools mutate state.

## P4 - Packet creation without execution

Status: planned

Goal: create work packets but do not run them yet.

Scope:

- Packet builder.
- Packet validator.
- Packet hashing.
- Packet idempotency key.
- Packet artifact layout.
- Policy validation before packet creation.
- MCP tools:
  - `se.create_mission`
  - `se.create_work_packet`

Acceptance criteria:

- Valid fixture packet is created and hashed.
- Invalid path/command packet is rejected.
- Duplicate idempotency key behaves deterministically.
- Packet does not contain credential values.

Stop conditions:

- Packet can contain generic shell without command allowlist.
- Packet allows branch target `main` for normal mission.

## P5 - Local worker fixture execution

Status: planned

Goal: prove a local worker can execute safe fixture packets.

Scope:

- `apps/worker` daemon skeleton.
- Worker config.
- Job lease protocol, initially file/mock based if DB is not ready.
- Packet download/read.
- Packet hash verify.
- Policy verify.
- Apply fixture file/script.
- Run validation command.
- Structured result output.

Acceptance criteria:

- Worker executes safe fixture.
- Worker rejects unsafe path fixture.
- Worker rejects unsafe command fixture.
- Worker reports result in schema-valid JSON.
- Worker does not require a local model.

Stop conditions:

- Worker starts making planning decisions.
- Worker runs command not present in allowed command list.
- Worker requests credential access unexpectedly.

## P6 - GitHub branch/PR integration

Status: planned

Goal: make packet output reviewable through GitHub.

Scope:

- Branch creation.
- Commit generation.
- Push mission branch.
- Open/update PR.
- PR body format.
- GitHub token integration.
- Safe branch naming.

Acceptance criteria:

- One safe packet creates a mission branch.
- One safe packet opens/updates a PR.
- PR body includes mission, files changed summary, validation, risk, and next action.
- No direct push to protected `main`.

Stop conditions:

- Worker attempts direct `main` push.
- GitHub token scope is broader than needed.
- Workflow edits occur without elevated mission.

## P7 - GitHub Actions proof

Status: planned

Goal: add CI as the proof layer.

Scope:

- `.github/workflows/ci.yml` as an elevated mission.
- Install.
- Typecheck.
- Test.
- Build.
- Policy fixture tests.
- Docker build smoke.
- Docs freshness check.

Acceptance criteria:

- CI runs on PR.
- CI passes on current scaffold.
- CI fails for unsafe policy regression.
- Receipt/handoff/docs freshness check exists, even if simple.

Stop conditions:

- Workflow permissions are broader than needed.
- CI performs autonomous repo mutation without explicit approval.

## P8 - Durable state and memory

Status: planned

Goal: add Postgres-backed durable state.

Scope:

- Migrations.
- Tables:
  - missions
  - jobs
  - work_packets
  - events
  - receipts
  - handoffs
  - upgrade_items
  - worker_leases
  - memory_items
- DB config.
- State Card from durable state.

Acceptance criteria:

- Migrations apply cleanly.
- State Card can be reconstructed from DB plus repo docs.
- Mission/job/event rows round-trip.
- Sensitive values are not written into receipts/events.

Stop conditions:

- DB becomes required for local dev without fallback.
- Render disk is used as mission memory.

## P9 - Full Render runtime hardening

Status: planned

Goal: harden the Render MCP runtime after read-only MCP is already live.

Scope:

- DB readiness in `/readyz` when DB is configured.
- Queue readiness in `/readyz` when queue is configured.
- Auth hardening.
- Render status adapter.
- Production `render.yaml` copied from example in an elevated mission when stable.
- Render service IDs recorded.

Acceptance criteria:

- Render deploys real MCP runtime.
- `/readyz` checks configured dependencies.
- `/status` returns current State Card.
- `/mcp` read-only tools work from ChatGPT app setup.

Stop conditions:

- Bootstrap fallback removed before real runtime is verified.
- Runtime logs sensitive values.
- Deployment requires manual dashboard steps not documented in `docs/RENDER_SETUP.md`.

## P10 - Golden path mission loop

Status: planned

Goal: one approved normal mission runs the full non-destructive loop.

Scope:

- `se.start_next_safe_mission`.
- Mission creation.
- Packet creation.
- Worker enqueue.
- Worker execution.
- Branch/PR.
- CI proof.
- Receipt/handoff/status/upgrade/build-plan update.

Acceptance criteria:

- User approves once.
- Packet executes.
- PR opens.
- CI passes.
- Docs update.
- New tab can resume from handoff.

Stop conditions:

- More than one normal approval needed for routine file edits/tests/PR.
- Unclear state after failure.
- Handoff is stale or missing next action.

## P11 - Hardening and recovery

Status: planned

Goal: make failures boring.

Scope:

- Retry policy.
- Lease expiry.
- Job quarantine.
- Worker fingerprint.
- Detection of accidental sensitive content.
- Failure memory.
- CI failure repair flow.
- Elevated mission protocol.
- Render reset recovery.
- Tab loss recovery.

Acceptance criteria:

- Worker crash requeues or quarantines cleanly.
- CI failure creates clear next action.
- Render reset reconstructs State Card.
- Unsafe packet never executes.
- Sensitive-looking content is blocked or escalated.

Stop conditions:

- Retried jobs double-apply patches.
- Failure creates ambiguous state.
- Recovery requires user terminal/dashboard inspection for normal cases.

## P12 - Research mode and optional surfaces

Status: later

Goal: add extended research/provenance without bloating normal build receipts.

Scope:

- Research ledger.
- Source/citation tracking.
- Extended research receipts.
- Optional status widget.
- Optional remote visual fallback design.

Acceptance criteria:

- Research artifacts live under `docs/research/`.
- Normal receipts stay compact.
- Optional widget is not required for normal operation.

Stop conditions:

- Research mode expands normal build complexity.
- Dashboard becomes required.
- Remote visual fallback becomes the main execution path.

## Immediate next mission: P1A

Title: Render-first real MCP vertical slice.

Class: normal mission.

Mission envelope:

- May create/edit minimal TypeScript package/app files.
- May update the root Dockerfile to start the real app.
- May add small tests and fixtures.
- May update operating docs.
- May not add write-capable MCP tools.
- May not add worker execution.
- May not add production `render.yaml`.
- May not require DB/queue.
- May not require new credentials beyond existing Render environment variables.

Expected files:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/mcp-server/package.json`
- `apps/mcp-server/tsconfig.json`
- `apps/mcp-server/src/index.ts`
- `apps/mcp-server/src/state-card.ts`
- minimal shared package files if needed
- tests for State Card and basic endpoint behavior
- updated `Dockerfile`
- updated ops docs

Acceptance tests:

- `pnpm install`
- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- Docker build succeeds.
- Render deploy succeeds.
- `/healthz`, `/readyz`, `/status`, and `/mcp` respond.
- `se.get_state_card` is available as a read-only MCP tool.

## Build-plan update rules

Update this file when:

- a phase starts
- a phase exits
- acceptance criteria change
- a new stop condition is discovered
- build order changes
- Render/GitHub/worker architecture changes
- a new mission supersedes the next mission

Do not use this file as a log. Use `ops/RECEIPT.md` for the latest completed action and future durable DB events for detailed history.
