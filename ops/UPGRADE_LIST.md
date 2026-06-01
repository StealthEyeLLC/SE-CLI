# Upgrade List

This file is the ranked build backlog. The top safe item should normally become the next mission.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.
Canonical no-API-charge addendum: `docs/NO_API_CHARGE_ARCHITECTURE.md`.

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
- Status: done
- Result: Render-hosted MCP runtime is live and connected to ChatGPT.
- Acceptance proof: `/healthz`, `/readyz`, `/status`, `/mcp`, and `se.get_state_card` work.
- Last touched: 2026-06-01

### U002 - Complete read-only MCP tools

- Priority score: 58
- Status: done
- Result: `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, and `se.read_latest_receipt` return structured data from the Render runtime.
- Last touched: 2026-06-01

### U003 - Add temporary constrained bootstrap writer

- Priority score: 44
- Status: done
- Result: `se.apply_single_file_update` can create/update one allowed UTF-8 repo file through GitHub.
- Boundaries: no shell, no delete, no workflow edits, no `render.yaml`, no env/secret/token/key files, no broad execution.
- Acceptance proof: created `ops/BOOTSTRAP_WRITE_TEST.md` through SE-CLI MCP.
- Last touched: 2026-06-01

### U004 - Add core envelopes, schemas, policy verdicts, and deterministic continuation contracts

- Priority score: 82
- Status: next
- Why now: The integrated spec and no-API-charge addendum require app/server envelopes, build-list structure, mission/job/result contracts, authority classes, failure classes, policy verdicts, and deterministic continuation contracts before packets or workers exist.
- Unblocks: thin-app tools, build-list engine, async mission controller, deterministic continuation controller, packet builder, worker validation, durable storage, result packets, boundary requests.
- Risk reduced: Prevents vague contracts, hidden model loops, and unsafe mission shapes before anything can execute.
- Effort: medium
- Blast radius: low
- Acceptance tests: schema fixtures validate deterministically; normal allowed fixture passes; elevated fixture requires boundary classification; invalid scope/path/command fixture fails; deterministic continuation fixture advances only mechanical states; novel repair fixture returns `needs_chatgpt`; boundary fixture returns `needs_user`; result packet fixture supports tiny/standard/artifact-pointer views.
- Last touched: 2026-06-01

### U005 - Add build-list engine skeleton

- Priority score: 68
- Status: queued
- Why now: Build lists must become executable project structure so “Build the list” maps to deterministic state transitions.
- Unblocks: start_build_list, continue, progress display, pause/resume/skip/cancel, next-item selection.
- Risk reduced: Prevents huge vague mega-missions by converting project work into bounded items.
- Effort: medium
- Blast radius: low
- Acceptance tests: load build-list fixture; pick next unblocked item by deterministic rules; update item status; report progress; stop when the next step needs ChatGPT or user authority.
- Last touched: 2026-06-01

### U006 - Add mission and async job controller skeleton

- Priority score: 66
- Status: queued
- Why now: Long operations need mission/job IDs, idempotency, status, and resumability before execution.
- Unblocks: start_mission, get_status, get_result, queue manager, worker leases.
- Risk reduced: Prevents duplicate jobs and fragile same-response execution.
- Effort: medium
- Blast radius: low
- Acceptance tests: start mission returns mission/job IDs; repeated idempotency key returns existing state; mission/job status reconstructs cleanly.
- Last touched: 2026-06-01

### U007 - Add deterministic continuation controller skeleton

- Priority score: 64
- Status: queued
- Why now: This replaces the removed API-side model controller lane and enables no-charge background progress.
- Unblocks: no-cost overnight mode, continue/build-list loop, CI watch, worker lease recovery.
- Risk reduced: Makes autonomy honest and prevents hidden token-metered reasoning.
- Effort: medium
- Blast radius: low
- Acceptance tests: mechanical pass advances; proof-pending waits; known flake retries by rule; expired lease requeues/quarantines; novel repair returns `needs_chatgpt`; boundary returns `needs_user`; uncertainty pauses.
- Last touched: 2026-06-01

### U008 - Add packet creation and validation without execution

- Priority score: 62
- Status: queued
- Why now: Packets are the execution contract and must exist before workers can run anything.
- Unblocks: worker fixture execution, policy enforcement, artifact storage.
- Risk reduced: Prevents generic remote shell creep.
- Effort: medium
- Blast radius: normal
- Acceptance tests: valid fixture packet is created and hashed; invalid packet is rejected; duplicate idempotency behaves deterministically; packet cannot contain generic unbounded commands.
- Last touched: 2026-06-01

### U009 - Add local worker fixture execution

- Priority score: 58
- Status: queued
- Why now: Worker must prove lease/verify/apply/validate/report before real repo mutation.
- Unblocks: GitHub PR loop.
- Risk reduced: Confirms scripts run only inside bounded packets.
- Effort: medium
- Blast radius: normal
- Acceptance tests: safe fixture executes; invalid command/path fixture stops; worker reports schema-valid result; no local AI model required.
- Last touched: 2026-06-01

### U010 - Add Git branch, commit, push, and PR automation

- Priority score: 54
- Status: queued
- Why now: Mission output must become a reviewable PR artifact.
- Unblocks: CI proof loop and repair updates.
- Risk reduced: Prevents silent direct mutation of protected branches.
- Effort: medium
- Blast radius: normal
- Acceptance tests: one safe packet creates/updates one mission branch and PR; PR body contains mission, scope, changed files, proof, limitations, and next action.
- Last touched: 2026-06-01

### U011 - Add GitHub Actions proof and failure compression

- Priority score: 52
- Status: queued
- Why now: Work is not complete until proof is read and compressed into a usable result packet.
- Unblocks: ChatGPT-mediated repair loop and mission closure.
- Risk reduced: Prevents unverified changes, raw-log overload, and hidden model interpretation.
- Effort: medium
- Blast radius: normal
- Acceptance tests: CI pass marks mission passed; CI failure returns compressed failure packet with classification and recommended next action; no API-side model call is made.
- Last touched: 2026-06-01

### U012 - Add continue/fix/build-list loop

- Priority score: 50
- Status: queued
- Why now: Natural commands like continue and fix it must map to server state transitions and ChatGPT-mediated reasoning.
- Unblocks: low-friction user loop.
- Risk reduced: Prevents ChatGPT from improvising next actions without server state.
- Effort: medium
- Blast radius: normal
- Acceptance tests: continue returns running status, starts next item, starts allowed deterministic repair, or returns boundary/ChatGPT-needed request; fix it starts scoped repair when ChatGPT supplies instruction.
- Last touched: 2026-06-01

### U013 - Add receipt, handoff, status, build plan, and upgrade auto-update

- Priority score: 46
- Status: queued
- Why now: New tabs must resume without prior chat context.
- Unblocks: durable tab handoffs.
- Risk reduced: Prevents stale operational docs.
- Effort: medium
- Blast radius: low
- Acceptance tests: mission closure updates operating docs consistently.
- Last touched: 2026-06-01

### U014 - Add Postgres durable mission/memory state

- Priority score: 45
- Status: queued
- Why now: Runtime state must survive Render reset, tab loss, and worker crash.
- Unblocks: async recovery, leases, build-list continuation.
- Risk reduced: Prevents chat memory from becoming authoritative state.
- Effort: high
- Blast radius: normal
- Acceptance tests: migrations run; build-list/mission/job/packet/result/boundary rows round-trip.
- Last touched: 2026-06-01

### U015 - Add Render runtime hardening and connector diagnostics

- Priority score: 42
- Status: queued
- Why now: The real MCP service needs dependency readiness, Render status, runtime version, and diagnostic behavior.
- Unblocks: stable hosted control plane.
- Risk reduced: Reduces confusion between connector visibility, Render cold starts, and actual server failures.
- Effort: medium
- Blast radius: normal
- Acceptance tests: `/healthz`, `/readyz`, `/status`, MCP endpoint, and `se.diagnose_connector` remain stable on Render.
- Last touched: 2026-06-01

### U016 - Add elevated boundary protocol

- Priority score: 39
- Status: queued
- Why now: Rare elevated actions need clean structured requests instead of repeated ad hoc prompts.
- Unblocks: workflow/deploy/security changes when explicitly approved.
- Risk reduced: Prevents silent escalation.
- Effort: medium
- Blast radius: normal
- Acceptance tests: boundary request fixture includes type, reason, action, impact, alternatives, recommendation, approval phrase, and can-continue-other-items flag.
- Last touched: 2026-06-01

### U017 - Add optional ChatGPT Task heartbeat lane

- Priority score: 34
- Status: later
- Why now: Heartbeat checks may be useful if available inside the user's current ChatGPT plan and not API-billed.
- Unblocks: no-cost status reminders and pseudo-callback behavior.
- Risk reduced: Keeps continuation honest without hidden API charges.
- Effort: medium
- Blast radius: low
- Acceptance tests: scheduled check can read state and report/continue deterministic approved work; if Tasks are unavailable, manual resume remains the default.
- Last touched: 2026-06-01

### U018 - Add research mode

- Priority score: 30
- Status: later
- Why now: Research requires extended citations/provenance, separate from normal build receipts.
- Unblocks: publishable research packets.
- Risk reduced: Keeps normal build receipts compact.
- Effort: medium
- Blast radius: low
- Acceptance tests: research ledger captures citations and extended receipt.
- Last touched: 2026-06-01
