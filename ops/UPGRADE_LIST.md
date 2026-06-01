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

### U001 - Create repository/package scaffold

- Priority score: 62
- Status: next
- Why now: Runtime code cannot begin cleanly until the monorepo/package spine exists.
- Unblocks: TypeScript packages, MCP server, worker, tests, CI.
- Risk reduced: Prevents ad hoc file layout and root document forest.
- Effort: medium
- Blast radius: low
- Acceptance tests: `pnpm install`, `pnpm typecheck`, `pnpm test` placeholders or real commands pass.
- Last touched: 2026-06-01

### U002 - Add schemas and normal/elevated mission policy tests

- Priority score: 60
- Status: queued
- Why now: Mission, packet, receipt, handoff, and State Card contracts must exist before execution.
- Unblocks: MCP tools, worker validation, durable storage.
- Risk reduced: Blocks unsafe packets early.
- Effort: medium
- Blast radius: low
- Acceptance tests: Safe fixtures pass; unsafe path/command/secret fixtures fail.
- Last touched: 2026-06-01

### U003 - Add read-only MCP server and State Card tool

- Priority score: 56
- Status: queued
- Why now: ChatGPT needs a low-risk way to inspect repo state before launching missions.
- Unblocks: Natural-language operating loop.
- Risk reduced: Establishes read-only tool surface before writes.
- Effort: medium
- Blast radius: low
- Acceptance tests: `se.get_state_card` returns structured current state.
- Last touched: 2026-06-01

### U004 - Add work packet creation and validation

- Priority score: 55
- Status: queued
- Why now: Packets are the central mass-file/script execution primitive.
- Unblocks: Worker execution.
- Risk reduced: Prevents generic remote shell creep.
- Effort: medium
- Blast radius: normal
- Acceptance tests: Packet hash/validation fixtures pass; invalid packets are rejected.
- Last touched: 2026-06-01

### U005 - Add local worker fixture execution

- Priority score: 53
- Status: queued
- Why now: Worker must prove lease/verify/apply/test/report before real repo mutation.
- Unblocks: Branch/PR loop.
- Risk reduced: Confirms scripts run only inside packets.
- Effort: medium
- Blast radius: normal
- Acceptance tests: Safe fixture executes; unsafe command/path fixture stops.
- Last touched: 2026-06-01

### U006 - Add Git branch, commit, push, and PR automation

- Priority score: 50
- Status: queued
- Why now: Mission output must become a reviewable PR artifact.
- Unblocks: CI proof loop.
- Risk reduced: Prevents direct protected-branch mutation.
- Effort: medium
- Blast radius: normal
- Acceptance tests: One packet creates one mission branch and PR.
- Last touched: 2026-06-01

### U007 - Add GitHub Actions CI proof workflow

- Priority score: 49
- Status: queued
- Why now: Work is not complete until CI proves it.
- Unblocks: Mission closure.
- Risk reduced: Prevents unverified changes from being treated as done.
- Effort: medium
- Blast radius: normal
- Acceptance tests: typecheck/test/build/policy/docs checks run on PR.
- Last touched: 2026-06-01

### U008 - Add receipt, handoff, status, and upgrade auto-update

- Priority score: 46
- Status: queued
- Why now: New tabs must resume without prior chat context.
- Unblocks: Durable tab handoffs.
- Risk reduced: Prevents stale operational docs.
- Effort: medium
- Blast radius: low
- Acceptance tests: Mission closure updates all four docs consistently.
- Last touched: 2026-06-01

### U009 - Add Postgres durable mission/memory state

- Priority score: 45
- Status: queued
- Why now: Runtime state must survive Render reset, tab loss, and worker crash.
- Unblocks: Async recovery.
- Risk reduced: Prevents chat memory from becoming authoritative state.
- Effort: high
- Blast radius: normal
- Acceptance tests: migrations run; mission/job/event/receipt/handoff rows round-trip.
- Last touched: 2026-06-01

### U010 - Add Render deployment and status adapter

- Priority score: 42
- Status: queued
- Why now: MCP server needs stable hosted endpoint once runtime code exists.
- Unblocks: ChatGPT custom app connection.
- Risk reduced: Standardizes deployment before manual drift.
- Effort: medium
- Blast radius: normal
- Acceptance tests: `/healthz`, `/readyz`, and MCP endpoint reachable on Render.
- Last touched: 2026-06-01

### U011 - Add elevated mission protocol

- Priority score: 39
- Status: queued
- Why now: Workflow/deploy/security changes need explicit named authority.
- Unblocks: Safe infrastructure changes.
- Risk reduced: Prevents silent escalation.
- Effort: medium
- Blast radius: normal
- Acceptance tests: elevated fixtures require elevated approval metadata.
- Last touched: 2026-06-01

### U012 - Add research mode

- Priority score: 30
- Status: later
- Why now: Research requires extended citations/provenance, separate from normal build receipts.
- Unblocks: publishable research packets.
- Risk reduced: Keeps normal build receipts compact.
- Effort: medium
- Blast radius: low
- Acceptance tests: research ledger captures citations and extended receipt.
- Last touched: 2026-06-01
