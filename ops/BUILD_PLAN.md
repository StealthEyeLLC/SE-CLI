# Build Plan

This is the living implementation plan for SE-CLI. Update this file whenever build order, scope, acceptance criteria, or current phase changes.

## Operating doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans and reports. The MCP control plane owns state, memory, policy, packets, GitHub/Render integration, and handoff. Workers execute bounded packets. GitHub Actions proves results. Render hosts the MCP/control plane.

## Current build state

- Current phase: P0 - Bootstrap and operating spine
- Current mode: Render bootstrap verified
- Repo: `StealthEyeLLC/SE-CLI`
- Render service: `se-cli-mcp`
- Render URL: `https://se-cli-mcp.onrender.com`
- Render service id: `srv-d8ehlvvavr4c738olbm0`
- Bootstrap endpoints verified by user: `/healthz`, `/readyz`, `/status`
- Runtime status: placeholder bootstrap service only
- Real MCP runtime: not implemented yet
- Local worker: not implemented yet
- CI: not configured yet
- Database/queue: not configured yet

## Build principles

1. Build big coherent drops, not tiny toy slices.
2. Keep the user-facing UX inside ChatGPT.
3. Prefer one mission-level approval over per-file or per-command approvals.
4. Use work packets for mass file/script execution.
5. Keep workers deterministic: lease, verify, apply, test, commit, push, report.
6. Use GitHub Actions as proof before treating serious work as complete.
7. Keep Render as the always-on control plane, not the heavy build machine.
8. Do not expose generic shell execution as a ChatGPT-facing tool.
9. Update `ops/STATUS.md`, `ops/HANDOFF.md`, `ops/RECEIPT.md`, and this file when build state changes.
10. Do not widen secrets, deploy, workflow, or destructive authority without elevated approval.

## Milestone map

| Phase | Name | Status | Purpose |
|---|---|---|---|
| P0 | Bootstrap and operating spine | in progress | Establish docs, Render bootstrap, and updateable build plan |
| P1 | Repository/package scaffold | next | Create TypeScript monorepo skeleton and base commands |
| P2 | Schemas and policy core | planned | Define mission, packet, state card, receipt, handoff, and policy schemas |
| P3 | Read-only MCP runtime | planned | Replace bootstrap server with real MCP service and read tools |
| P4 | Packet creation without execution | planned | Create, validate, hash, and store work packets |
| P5 | Local worker fixture execution | planned | Lease and execute safe fixture packets locally |
| P6 | GitHub branch/PR integration | planned | Commit/push mission branches and open/update PRs |
| P7 | GitHub Actions proof | planned | Add CI and proof gates for repo/build/packet checks |
| P8 | Durable state and memory | planned | Add Postgres migrations and durable mission/job/memory storage |
| P9 | Render production runtime | planned | Deploy real MCP runtime on Render with health/readiness/status/MCP endpoints |
| P10 | Golden path mission loop | planned | One approval -> packet -> worker -> PR -> proof -> handoff |
| P11 | Hardening and recovery | planned | Retry, quarantine, failure memory, elevated mission handling |
| P12 | Research mode and optional surfaces | later | Add extended research receipts and optional status widget/visual fallback |

## P0 - Bootstrap and operating spine

Status: in progress

Goal: make the repo understandable, deployable as a bootstrap service, and ready for implementation missions.

Completed:

- README expanded with SE-CLI doctrine.
- `ops/OPERATOR_MANUAL.md` added.
- `ops/HANDOFF.md` added.
- `ops/STATUS.md` added.
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

Remaining:

- Add this living build plan.
- Update indexes and state docs to reference it.

Acceptance criteria:

- New tab can understand the system by reading `ops/OPERATOR_MANUAL.md`, `ops/HANDOFF.md`, `ops/STATUS.md`, `ops/BUILD_PLAN.md`, and `ops/UPGRADE_LIST.md`.
- Render bootstrap service responds on `/healthz`, `/readyz`, and `/status`.
- Next implementation mission is clear.

Exit condition:

- P0 exits when `ops/BUILD_PLAN.md` is committed and referenced from the operating docs.

## P1 - Repository/package scaffold

Status: next

Goal: create the TypeScript monorepo foundation without replacing the bootstrap service yet.

Scope:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- package folder skeletons
- app folder skeletons
- base scripts
- minimal test runner setup
- placeholder package exports
- updated Dockerfile only if needed to keep Render bootstrap working

Target structure:

- `apps/mcp-server/`
- `apps/worker/`
- `apps/status-widget/`
- `packages/se-core/`
- `packages/se-schemas/`
- `packages/se-policy/`
- `packages/se-memory/`
- `packages/se-packets/`
- `packages/se-receipts/`
- `packages/se-github/`
- `packages/se-render/`
- `packages/se-worker-protocol/`
- `packages/se-cli/`
- `tests/fixtures/`

Acceptance criteria:

- `pnpm install` works.
- `pnpm typecheck` exists and passes.
- `pnpm test` exists and passes.
- `pnpm build` exists and passes or has a documented placeholder implementation.
- Render bootstrap still deploys.
- Operational docs updated.

Stop conditions:

- Package manager conflict.
- Docker bootstrap breaks.
- Any secret/token accidentally enters repo files.

## P2 - Schemas and policy core

Status: planned

Goal: define contracts before building execution.

Scope:

- State Card schema
- Mission schema
- Job schema
- Work packet schema
- Receipt schema
- Handoff schema
- Upgrade item schema
- Worker heartbeat schema
- Normal/elevated/hard-stop approval class schema
- Path allowlist policy
- Command allowlist policy
- Risk scoring helper

Acceptance criteria:

- Safe mission fixture passes.
- Unsafe path fixture fails.
- Unsafe command fixture fails.
- Secret-like fixture fails.
- Workflow-edit fixture requires elevated approval.
- Production deploy fixture requires elevated approval.

Stop conditions:

- Policy permits generic shell execution.
- Policy allows protected branch mutation in normal missions.
- Schema contracts are vague or undocumented.

## P3 - Read-only MCP runtime

Status: planned

Goal: replace the bootstrap HTTP server with a real MCP-capable runtime while keeping safe read-only behavior first.

Scope:

- Real `apps/mcp-server` app.
- `/healthz` endpoint.
- `/readyz` endpoint.
- `/status` endpoint.
- `/mcp` endpoint.
- Read-only MCP tools:
  - `se.get_state_card`
  - `se.read_handoff`
  - `se.read_upgrade_list`
  - `se.read_latest_receipt`
  - `se.inspect_mission`
- Local mock state if DB is not wired yet.
- Render deploy keeps working.

Acceptance criteria:

- `/healthz` returns healthy.
- `/readyz` returns dependency readiness.
- `/status` returns State Card.
- `/mcp` supports initialize/list-tools for read-only tools.
- No write tools are exposed yet.

Stop conditions:

- Auth becomes overcomplicated before read-only tools work.
- Write tools are added before read-only MCP is verified.
- Render deploy breaks without a rollback path.

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
- Duplicate idempotency key returns existing packet/missions in the future DB-backed version or deterministic local behavior in mock mode.
- Packet does not contain secrets.

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
- Worker does not require local model.

Stop conditions:

- Worker starts making planning decisions.
- Worker runs command not present in allowed command list.
- Worker accesses secrets unexpectedly.

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
- Secrets are exposed to untrusted contexts.
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
- No secrets are stored in plaintext unless explicitly intended and encrypted.

Stop conditions:

- DB becomes required for local dev without fallback.
- Secrets are written into receipts/events.
- Render disk is used as mission memory.

## P9 - Render production runtime

Status: planned

Goal: convert Render from bootstrap service to real MCP runtime.

Scope:

- Root `Dockerfile` uses real app build/start.
- `/healthz`, `/readyz`, `/status`, `/mcp` remain stable.
- `docs/render-blueprint.example.yaml` becomes root `render.yaml` in an elevated mission when ready.
- Render env vars are simplified to only what runtime uses.
- Render service IDs recorded.

Acceptance criteria:

- Render deploys real MCP runtime.
- `/readyz` checks DB and queue when configured.
- `/status` returns real State Card.
- `/mcp` read-only tools work from ChatGPT app setup.

Stop conditions:

- Bootstrap fallback removed before real runtime is verified.
- Render secrets are logged.
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
- Receipt/handoff/status/upgrade update.

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
- Secret scan.
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
- Secret-like content is blocked or escalated.

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

## Immediate next mission: U001 / P1

Title: Create repository/package scaffold.

Class: normal mission.

Mission envelope:

- May create/edit root package config files.
- May create app/package skeleton directories.
- May add tests/fixtures.
- May update Dockerfile only if bootstrap remains deployable.
- May update ops/docs files.
- May not add secrets.
- May not add GitHub workflow yet unless separately elevated.
- May not deploy production behavior.

Expected files:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/mcp-server/package.json`
- `apps/worker/package.json`
- `packages/*/package.json`
- initial source/index files
- initial tests/fixtures
- updated ops docs

Acceptance tests:

- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Docker bootstrap still builds/deploys or the new Docker startup is verified.

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
