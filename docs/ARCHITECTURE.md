# Architecture

SE-CLI is a ChatGPT-operated mission control plane.

## Doctrine

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

## Components

### ChatGPT

Primary user interface and planning surface. The user gives goals and approvals in natural language. ChatGPT reads state through MCP tools, proposes missions, and reports results.

### SE-CLI MCP server

The control plane. It should run on Render as a web service once runtime code exists.

Responsibilities:

- expose read/status tools
- expose bounded mission tools
- record mission state
- generate work packets
- enforce policy gates
- enqueue worker jobs
- read GitHub/CI/Render status
- update handoff, status, receipt, and upgrade list
- provide durable memory access

The MCP server must not become a generic remote shell.

### Durable storage

Postgres is the authoritative runtime store for:

- missions
- jobs
- events
- work packets
- receipts
- handoffs
- upgrade items
- worker leases
- operational memory

Render disk and ChatGPT memory are not authoritative state.

### Queue/cache

Render Key Value/Valkey or a Postgres-backed queue should handle:

- job queues
- lease locks
- worker heartbeat acceleration
- short-lived status/cache data

Durable mission truth still belongs in Postgres.

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

Recommended resources once code exists:

- web service: `se-cli-mcp`
- background worker: `se-cli-maintenance`
- Postgres: `se-cli-db`
- Key Value/Valkey: `se-cli-kv`

Render is not the heavy build machine. Heavy builds run in local workers or GitHub Actions.

## Normal mission flow

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
12. MCP updates status/receipt/handoff/upgrade list.
13. ChatGPT reports final State Card.

## Execution lanes

### Lane 1: MCP direct edit

Small safe changes such as status, handoff, receipt, and upgrade-list updates.

### Lane 2: work packet/local worker

Main lane for real coding, many files, package installs, tests, Docker builds, migrations, and CLI smoke checks.

### Lane 3: GitHub Actions proof

Cloud proof layer for every serious change.

### Lane 4: remote visual fallback, future only

Optional later lane for dashboards, OAuth screens, screenshots, and browser/UI tasks that cannot be done cleanly through APIs or scripts.

## Work packet contents

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
- secret exposure
- permission drift

All recovery should begin from repository docs, GitHub state, Render state, and durable storage, not chat memory.
