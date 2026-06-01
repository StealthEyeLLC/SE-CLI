# Upgrade List

This file is the ranked build backlog. The top safe item should normally become the next mission.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.
Current control-plane upgrade note: `docs/MCP_CONTROL_PLANE_UPGRADES.md`.

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

### U003 - Add routine single-file update lane

- Priority score: 44
- Status: done
- Result: `se.apply_single_file_update` can create/update one allowed UTF-8 repo file through GitHub.
- Acceptance proof: created `ops/BOOTSTRAP_WRITE_TEST.md` through SE-CLI MCP.
- Last touched: 2026-06-01

### U004 - Add routine batch update lane

- Priority score: 60
- Status: done
- Result: `se.apply_file_batch` can create/update multiple allowed UTF-8 repo files from one ChatGPT tool call.
- Acceptance proof: created `ops/BATCH_WRITE_TEST_A.md` and `ops/BATCH_WRITE_TEST_B.md` through SE-CLI MCP.
- Last touched: 2026-06-01

### U005 - Add core envelopes, schemas, policy verdicts, and continuation contracts

- Priority score: 82
- Status: next
- Why now: The thin-app to MCP control-plane needs stable app/server envelopes, build-list structure, mission/job/result contracts, authority classes, failure classes, policy verdicts, and continuation decisions before packets or workers exist.
- Unblocks: final MCP tools, build-list engine, async mission controller, continuation controller, packet builder, worker validation, durable state, result packets, boundary requests.
- Risk reduced: Prevents vague contracts and unsafe mission shapes before anything can execute.
- Effort: medium
- Blast radius: low
- Acceptance tests: schema fixtures validate deterministically; normal allowed fixture passes; elevated fixture requires boundary classification; invalid scope/path/command fixture fails; clear continuation fixture advances only approved mechanical states; novel repair fixture returns needs-review; boundary fixture returns needs-user; result packet fixture supports tiny/standard/artifact-pointer views.
- Last touched: 2026-06-01

### U006 - Add build-list engine skeleton

- Priority score: 68
- Status: queued
- Why now: Build lists must become executable project structure so “Build the list” maps to deterministic state transitions.
- Unblocks: start_build_list, continue, progress display, pause/resume/skip/cancel, next-item selection.
- Risk reduced: Prevents huge vague mega-missions by converting project work into bounded items.
- Effort: medium
- Blast radius: low
- Acceptance tests: load build-list fixture; pick next unblocked item by clear rules; update item status; report progress; stop when the next step needs ChatGPT or user authority.
- Last touched: 2026-06-01

### U007 - Add mission and async job controller skeleton

- Priority score: 66
- Status: queued
- Why now: Long operations need mission/job IDs, idempotency, status, and resumability before execution.
- Unblocks: start_mission, get_status, get_result, queue manager, worker leases.
- Risk reduced: Prevents duplicate jobs and fragile same-response execution.
- Effort: medium
- Blast radius: low
- Acceptance tests: start mission returns mission/job IDs; repeated idempotency key returns existing state; mission/job status reconstructs cleanly.
- Last touched: 2026-06-01

### U008 - Add continuation controller skeleton

- Priority score: 64
- Status: queued
- Why now: The server needs a clear controller for continue/fix/build-list behavior.
- Unblocks: overnight-style progress, CI watch, worker lease recovery, low-friction continuation.
- Risk reduced: Makes state transitions explicit and prevents ad hoc continuation logic.
- Effort: medium
- Blast radius: low
- Acceptance tests: mechanical pass advances; proof-pending waits; expired lease requeues/quarantines; novel repair returns needs-review; boundary returns needs-user; uncertainty pauses.
- Last touched: 2026-06-01

### U009 - Add packet creation and validation without execution

- Priority score: 62
- Status: queued
- Why now: Packets are the execution contract and must exist before workers can run anything.
- Unblocks: worker fixture execution, policy enforcement, artifact storage.
- Risk reduced: Prevents generic remote shell creep.
- Effort: medium
- Blast radius: normal
- Acceptance tests: valid fixture packet is created and hashed; invalid packet is rejected; duplicate idempotency behaves deterministically; packet cannot contain generic unbounded commands.
- Last touched: 2026-06-01

### U010 - Add local worker fixture execution

- Priority score: 58
- Status: queued
- Why now: Worker must prove lease/verify/apply/validate/report before real repo mutation.
- Unblocks: GitHub PR loop.
- Risk reduced: Confirms scripts run only inside bounded packets.
- Effort: medium
- Blast radius: normal
- Acceptance tests: safe fixture executes; invalid command/path fixture stops; worker reports schema-valid result; no local AI model required.
- Last touched: 2026-06-01

### U011 - Add Git branch, commit, push, and PR automation

- Priority score: 54
- Status: queued
- Why now: Mission output must become a reviewable PR artifact.
- Unblocks: CI proof loop and repair updates.
- Risk reduced: Prevents silent direct mutation of protected branches.
- Effort: medium
- Blast radius: normal
- Acceptance tests: one safe packet creates/updates one mission branch and PR; PR body contains mission, scope, changed files, proof, limitations, and next action.
- Last touched: 2026-06-01

### U012 - Add GitHub Actions proof and failure compression

- Priority score: 52
- Status: queued
- Why now: Work is not complete until proof is read and compressed into a usable result packet.
- Unblocks: ChatGPT-mediated repair loop and mission closure.
- Risk reduced: Prevents unverified changes and raw-log overload.
- Effort: medium
- Blast radius: normal
- Acceptance tests: CI pass marks mission passed; CI failure returns compressed failure packet with classification and recommended next action.
- Last touched: 2026-06-01

### U013 - Add continue/fix/build-list loop

- Priority score: 50
- Status: queued
- Why now: Natural commands like continue and fix it must map to server state transitions and ChatGPT-mediated repair.
- Unblocks: low-friction user loop.
- Risk reduced: Prevents ChatGPT from improvising next actions without server state.
- Effort: medium
- Blast radius: normal
- Acceptance tests: continue returns running status, starts next item, starts allowed repair, or returns boundary/review-needed request; fix it starts scoped repair when ChatGPT supplies instruction.
- Last touched: 2026-06-01

### U014 - Add durable mission/memory state

- Priority score: 45
- Status: queued
- Why now: Runtime state must survive Render reset, tab loss, and worker crash.
- Unblocks: async recovery, leases, build-list continuation.
- Risk reduced: Prevents chat memory from becoming authoritative state.
- Effort: high
- Blast radius: normal
- Acceptance tests: build-list/mission/job/packet/result/boundary rows round-trip.
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
