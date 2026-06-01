# Architecture

SE-CLI is a ChatGPT-operated autonomy control plane.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.

## Doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

## One-sentence architecture

ChatGPT remains the natural-language commander and reviewer. A thin ChatGPT App/MCP connector forwards mission-level intent to the SE-CLI control server. The server owns state, build lists, missions, packets, policy, queueing, integrations, and result compression. Deterministic workers execute bounded packets. GitHub and CI prove results. Structured result packets return to ChatGPT for review, repair, and continuation.

## Current state

The Render-hosted MCP runtime is live and read-only. It exposes verified read tools for State Card and operating docs. The next implementation target is P2A: core envelopes, schemas, authority classes, failure classes, and policy verdict fixtures.

## Components

### ChatGPT

Primary user interface and review layer. ChatGPT plans missions, interprets build lists, reviews result packets, analyzes compressed failures, submits repair instructions, summarizes outcomes, and asks the user for real boundary decisions.

ChatGPT is not the execution engine.

### Thin ChatGPT App / MCP connector

The app is a narrow bridge. It exposes a small set of high-level tools and forwards intent to the SE-CLI control server.

It should not expose broad filesystem, shell, git, browser, or deployment primitives as the normal work surface.

### SE-CLI control server

The control plane. It runs on Render as a web service.

Current responsibility:

- `/healthz`
- `/readyz`
- `/status`
- `/mcp`
- verified read-only MCP tools
- static/doc-backed state until durable storage exists

Target responsibilities:

- mission queue
- build-list state
- work packet creation
- policy checks
- authority boundaries
- worker dispatch
- job queue
- repo state
- GitHub integration
- CI result reading
- Render status reading
- artifact pointers
- durable memory
- handoff state
- receipts
- repair-loop orchestration
- ChatGPT-facing result formatting

The server must not become a generic remote shell.

### Durable storage

Postgres or equivalent durable storage will become authoritative runtime state for:

- build lists
- build-list items
- missions
- jobs
- packets
- events
- receipts
- handoffs
- result packets
- boundary requests
- worker leases
- failure patterns
- operational memory

Render disk and ChatGPT memory are not authoritative state.

### Queue/cache

A queue/cache layer should handle job queues, leases, heartbeats, retry state, and short-lived status acceleration. It may be Postgres-backed initially.

### Workers

Workers are deterministic execution appliances. They do not require local AI models.

Lifecycle:

**lease -> verify -> prepare workspace -> apply -> validate -> commit -> push -> open/update PR -> report**

Workers lease jobs, verify packets, create isolated branches/worktrees, apply packet contents, run allowed validation commands, commit, push, open/update PRs, and report structured results.

Workers do not invent product direction, add commands, widen scope, or decide architecture.

### GitHub

GitHub is the repository and PR review surface. Normal coding missions should create or update mission branches and PRs rather than silently mutating `main` once the worker/PR loop exists.

### GitHub Actions / CI

CI is the proof surface. Serious implementation work is complete only when CI or an approved equivalent proof path passes.

### Render

Render hosts the always-on MCP/control server. Render is not the heavy build machine. Heavy build/test work runs in local workers, GitHub Actions, or future specialized workers.

Current Render resource:

- service: `se-cli-mcp`
- URL: `https://se-cli-mcp.onrender.com`
- service id: `srv-d8ehlvvavr4c738olbm0`

## Primary loop

1. User approves a mission or build list.
2. ChatGPT calls a thin SE-CLI tool.
3. Server creates or resumes the queue run.
4. Server selects the next unblocked build-list item.
5. Server creates a mission.
6. Server creates a bounded work packet.
7. Worker leases the packet.
8. Worker applies changes and validates.
9. Worker commits, pushes, and opens/updates PR.
10. CI runs.
11. Server reads CI state.
12. Server marks pass, starts allowed repair, or returns a boundary request.
13. ChatGPT summarizes and continues, fixes, pauses, or asks the user for a decision.

## Tool surface target

Read/status tools:

- `se.get_state`
- `se.get_build_list`
- `se.get_current_mission`
- `se.get_status`
- `se.get_result`

Action tools:

- `se.start_build_list`
- `se.start_mission`
- `se.continue`
- `se.submit_fix`
- `se.retry_failed`
- `se.pause`
- `se.cancel`
- `se.approve_boundary`

Diagnostic tool:

- `se.diagnose_connector`

Current read-only bootstrap tools may remain as compatibility helpers until replaced by the final names.

## Execution lanes

### Lane 1: MCP read/status

Current verified lane. Read-only tools inspect state and operating docs.

### Lane 2: schemas and policy

Next lane. Define envelopes, state contracts, authority classes, failure classes, result packets, and policy verdict fixtures before write tools exist.

### Lane 3: packet creation without execution

Server creates and validates packets but does not dispatch workers yet.

### Lane 4: worker fixture execution

Worker executes safe fixture packets and returns structured reports.

### Lane 5: GitHub/PR/CI loop

Worker creates branches/PRs and server watches CI proof.

### Lane 6: build-list continuation and repair

Server supports continue/fix/build-list loop with compact result packets and boundary requests.

## Work packet contents

A packet should include:

- packet metadata
- mission ID
- policy
- allowed paths
- allowed commands
- expected hashes
- files/patches/scripts
- validation plan
- rollback/recovery notes
- receipt/result template
- packet hash

## Result packet views

Each result packet should provide:

- tiny summary: 10 lines or fewer
- standard summary: enough for ChatGPT to decide the next action
- full detail: artifact/log pointers

Raw logs should not be sent to ChatGPT by default.

## State Card

The system should always reduce to:

- Mission
- Mode
- Branch
- PR
- CI
- Worker
- Render
- Last action
- Next action
- Blocked
- Needs approval
- Risk
- Updated

## Primary failure modes

- Render reset
- tab loss
- connector visibility loss
- worker crash
- CI failure
- Git conflict
- invalid packet
- stale expected hashes
- accidental sensitive content
- permission drift
- missing credential
- ambiguous product decision

All recovery should begin from durable server state, repository docs, GitHub state, Render state, and artifacts, not ChatGPT memory.
