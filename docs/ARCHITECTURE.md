# Architecture

SE-CLI is a ChatGPT-operated mission control plane.

## Doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

## Current architecture direction

The immediate next build is Render-first, not scaffold-first.

The repo already has a live Render bootstrap service. The next implementation mission should replace the placeholder HTTP server with a real TypeScript MCP runtime while keeping the scope read-only and safe.

## Components

### ChatGPT

Primary user interface and planning surface. The user gives goals and approvals in natural language. ChatGPT reads state through MCP tools, proposes missions, and reports results.

### SE-CLI MCP server

The control plane. It runs on Render as a web service.

Immediate P1A responsibility:

- keep `/healthz` stable
- keep `/readyz` stable
- keep `/status` stable
- replace placeholder `/mcp` with a real MCP endpoint
- expose first read-only tool: `se.get_state_card`
- require no DB or queue yet
- expose no write tools yet

Later responsibilities:

- expose read/status tools
- expose bounded mission tools
- record mission state
- generate work packets
- enforce policy gates
- enqueue worker jobs
- read GitHub/CI/Render status
- update handoff, status, build plan, receipt, and upgrade list
- provide durable memory access

The MCP server must not become a generic remote shell.

### Durable storage

Postgres will become the authoritative runtime store for:

- missions
- jobs
- events
- work packets
- receipts
- handoffs
- upgrade items
- worker leases
- operational memory

P1A must not require Postgres. It should use static/mock state derived from repo docs until durable storage is implemented.

Render disk and ChatGPT memory are not authoritative state.

### Queue/cache

Render Key Value/Valkey or a Postgres-backed queue should later handle:

- job queues
- lease locks
- worker heartbeat acceleration
- short-lived status/cache data

P1A must not require queue/cache.

### Local worker

The execution appliance. It runs on a local machine but does not use local models.

Lifecycle:

**lease -> verify -> apply -> test -> commit -> push -> report**

Responsibilities:

- lease one job
- download packet
- verify packet hash
- check policy
- create isolated git worktree/branch
- apply approved scripts/files/patches
- run validation commands
- commit changes
- push mission branch
- open/update PR
- report structured result

The worker is planned after the real read-only MCP app exists.

### GitHub

Source of truth for repository files and PR review surface.

Normal changes should land on mission branches, not directly on protected `main` once the worker/PR loop exists.

### GitHub Actions

Proof engine. Serious work is complete only after CI proves it.

Recommended checks:

- install
- lint
- typecheck
- unit tests
- integration tests
- build
- CLI smoke
- MCP smoke
- packet policy tests
- migration check
- secret scan
- docs freshness check
- receipt/handoff consistency check

### Render

Always-on hosted control plane.

Current resource:

- web service: `se-cli-mcp`
- URL: `https://se-cli-mcp.onrender.com`
- service id: `srv-d8ehlvvavr4c738olbm0`

Recommended later resources:

- background worker: `se-cli-maintenance`
- Postgres: `se-cli-db`
- Key Value/Valkey: `se-cli-kv`

Render is not the heavy build machine. Heavy builds run in local workers or GitHub Actions.

## P1A normal mission flow

1. Add minimal TypeScript scaffold.
2. Add real `apps/mcp-server` app.
3. Preserve `/healthz`, `/readyz`, and `/status`.
4. Replace placeholder `/mcp` with real read-only MCP runtime.
5. Add `se.get_state_card` tool.
6. Update Dockerfile to start the real app.
7. Deploy to Render.
8. Verify endpoints.
9. Update status, handoff, receipt, and build plan.

## Full normal mission flow, later

1. ChatGPT reads State Card.
2. ChatGPT proposes mission.
3. User approves once.
4. MCP creates mission and packet.
5. Worker leases packet.
6. Worker verifies policy and hashes.
7. Worker applies files/scripts/patches.
8. Worker runs validation.
9. Worker commits and pushes branch.
10. Worker opens/updates PR.
11. GitHub Actions verifies.
12. MCP updates status/receipt/handoff/upgrade list/build plan.
13. ChatGPT reports final State Card.

## Execution lanes

### Lane 1: MCP read/status

Current next lane. Read-only tools inspect state and do not mutate files.

### Lane 2: MCP direct edit

Later lane for small safe changes such as status, handoff, receipt, and upgrade-list updates.

### Lane 3: work packet/local worker

Main lane for real coding, many files, package installs, tests, Docker builds, migrations, and CLI smoke checks.

### Lane 4: GitHub Actions proof

Cloud proof layer for every serious change.

### Lane 5: remote visual fallback, future only

Optional later lane for dashboards, OAuth screens, screenshots, and browser/UI tasks that cannot be done cleanly through APIs or scripts.

## Work packet contents, later

A packet should contain:

- `packet.json`
- `policy.json`
- `allowed_paths.json`
- `allowed_commands.json`
- `expected_hashes.json`
- `apply.ps1`
- `apply.sh`
- `files/`
- `patches/`
- `validation.json`
- `receipt.template.json`

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
- worker crash
- CI failure
- Git conflict
- unsafe packet
- stale expected hashes
- accidental sensitive content
- permission drift

All recovery should begin from repository docs, GitHub state, Render state, and durable storage, not chat memory.
