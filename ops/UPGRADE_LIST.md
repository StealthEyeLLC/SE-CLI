# Upgrade List

This file is the ranked build backlog. The top safe item should normally become the next mission.

## Scoring

`score = 5I + 4U + 4R + 3F + 2C - 3E - 4B`

- I = impact
- U = unblocks future work
- R = risk reduction
- F = frequency of use
- C = clarity/user value
- E = effort
- B = blast radius

## Items

### U001 - Render-first real MCP vertical slice

- Priority score: 76
- Status: next
- Why now: The fastest path to usefulness is replacing the Render bootstrap placeholder with a real read-only MCP app before broad scaffolding.
- Unblocks: ChatGPT app connection, real State Card reads, MCP tool testing, future write/packet tools.
- Risk reduced: Proves the deployed control-plane path early while keeping tools read-only.
- Effort: medium
- Blast radius: normal
- Acceptance tests: `pnpm install`, `pnpm build`, `pnpm typecheck`, `pnpm test`, Docker build, Render deploy, `/healthz`, `/readyz`, `/status`, `/mcp`, and read-only `se.get_state_card` tool all work.
- Last touched: 2026-06-01

### U002 - Focused repository/package scaffold expansion

- Priority score: 61
- Status: queued
- Why now: After the real MCP app exists, expand only the packages needed for packets, workers, policy, memory, and receipts.
- Unblocks: packet creation, worker execution, GitHub integration, durable memory.
- Risk reduced: Prevents decorative monorepo structure before a working app exists.
- Effort: medium
- Blast radius: low
- Acceptance tests: existing real MCP app still deploys; package boundaries are useful; base scripts still pass.
- Last touched: 2026-06-01

### U003 - Add schemas and normal/elevated mission policy tests

- Priority score: 60
- Status: queued
- Why now: Mission, packet, receipt, handoff, and State Card contracts must exist before execution.
- Unblocks: MCP tools, worker validation, durable storage.
- Risk reduced: Blocks unsafe packets early.
- Effort: medium
- Blast radius: low
- Acceptance tests: Safe fixtures pass; unsafe path/command/credential-like fixtures fail.
- Last touched: 2026-06-01

### U004 - Complete read-only MCP tools

- Priority score: 58
- Status: queued
- Why now: ChatGPT needs a low-risk way to inspect repo state before launching missions.
- Unblocks: Natural-language operating loop.
- Risk reduced: Establishes read-only tool surface before writes.
- Effort: medium
- Blast radius: low
- Acceptance tests: `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, and `se.read_latest_receipt` return structured data.
- Last touched: 2026-06-01

### U005 - Add work packet creation and validation

- Priority score: 55
- Status: queued
- Why now: Packets are the central mass-file/script execution primitive.
- Unblocks: Worker execution.
- Risk reduced: Prevents generic remote shell creep.
- Effort: medium
- Blast radius: normal
- Acceptance tests: Packet hash/validation fixtures pass; invalid packets are rejected.
- Last touched: 2026-06-01

### U006 - Add local worker fixture execution

- Priority score: 53
- Status: queued
- Why now: Worker must prove lease/verify/apply/report before real repo mutation.
- Unblocks: Branch/PR loop.
- Risk reduced: Confirms scripts run only inside packets.
- Effort: medium
- Blast radius: normal
- Acceptance tests: Safe fixture executes; unsafe command/path fixture stops.
- Last touched: 2026-06-01

### U007 - Add Git branch, commit, push, and PR automation

- Priority score: 50
- Status: queued
- Why now: Mission output must become a reviewable PR artifact.
- Unblocks: CI proof loop.
- Risk reduced: Prevents direct protected-branch mutation.
- Effort: medium
- Blast radius: normal
- Acceptance tests: One packet creates one mission branch and PR.
- Last touched: 2026-06-01

### U008 - Add GitHub Actions CI proof workflow

- Priority score: 49
- Status: queued
- Why now: Work is not complete until CI proves it.
- Unblocks: Mission closure.
- Risk reduced: Prevents unverified changes from being treated as done.
- Effort: medium
- Blast radius: normal
- Acceptance tests: typecheck/test/build/policy/docs checks run on PR.
- Last touched: 2026-06-01

### U009 - Add receipt, handoff, status, build plan, and upgrade auto-update

- Priority score: 46
- Status: queued
- Why now: New tabs must resume without prior chat context.
- Unblocks: Durable tab handoffs.
- Risk reduced: Prevents stale operational docs.
- Effort: medium
- Blast radius: low
- Acceptance tests: Mission closure updates all operating docs consistently.
- Last touched: 2026-06-01

### U010 - Add Postgres durable mission/memory state

- Priority score: 45
- Status: queued
- Why now: Runtime state must survive Render reset, tab loss, and worker crash.
- Unblocks: Async recovery.
- Risk reduced: Prevents chat memory from becoming authoritative state.
- Effort: high
- Blast radius: normal
- Acceptance tests: migrations run; mission/job/event/receipt/handoff rows round-trip.
- Last touched: 2026-06-01

### U011 - Add Render runtime hardening and status adapter

- Priority score: 42
- Status: queued
- Why now: The real MCP service needs DB/queue readiness, Render status, and eventually a production Blueprint.
- Unblocks: stable hosted control plane.
- Risk reduced: Standardizes deployment before manual drift.
- Effort: medium
- Blast radius: normal
- Acceptance tests: `/healthz`, `/readyz`, `/status`, and MCP endpoint remain stable on Render with dependency readiness.
- Last touched: 2026-06-01

### U012 - Add elevated mission protocol

- Priority score: 39
- Status: queued
- Why now: Workflow/deploy/security changes need explicit named authority.
- Unblocks: Safe infrastructure changes.
- Risk reduced: Prevents silent escalation.
- Effort: medium
- Blast radius: normal
- Acceptance tests: elevated fixtures require elevated approval metadata.
- Last touched: 2026-06-01

### U013 - Add research mode

- Priority score: 30
- Status: later
- Why now: Research requires extended citations/provenance, separate from normal build receipts.
- Unblocks: publishable research packets.
- Risk reduced: Keeps normal build receipts compact.
- Effort: medium
- Blast radius: low
- Acceptance tests: research ledger captures citations and extended receipt.
- Last touched: 2026-06-01
