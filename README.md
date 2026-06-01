# SE-CLI

SE-CLI is the StealthEye command/control spine for ChatGPT-operated build missions.

The operating doctrine is:

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

The user talks to ChatGPT. ChatGPT plans and calls the SE-CLI MCP control plane. The MCP server records mission state, creates bounded work packets, queues local workers, reads GitHub/CI/Render state, and updates compact operational docs. Local workers execute packets. GitHub Actions proves the result. Handoffs preserve continuity for the next ChatGPT tab.

## Current repository state

This repository currently contains the operating documentation spine, root `AGENTS.md`, living build plan, and Render bootstrap Docker service. Runtime MCP server code, worker code, CI, and production Render Blueprint files should be added through approved SE-CLI missions.

## Core UX target

The user should normally see only the ChatGPT conversation.

Normal work should require one mission-level approval, not per-file, per-command, or per-click approvals.

## Canonical operating model

1. User gives a goal in ChatGPT.
2. ChatGPT reads the current state and proposes one bounded mission.
3. User approves the mission.
4. MCP creates a bounded work packet.
5. A local worker executes the packet in an isolated branch/worktree.
6. The worker commits, pushes, and opens or updates a PR.
7. GitHub Actions verifies the work.
8. MCP updates status, receipt, handoff, upgrade list, and build plan when needed.
9. ChatGPT reports the result and next safest action.

## Agent instructions

- `AGENTS.md` - root cross-agent instruction surface. Any assistant, coding agent, local worker, or future automated tool should read this before planning or changing files.

## Operating docs

- `ops/OPERATOR_MANUAL.md` - how a new ChatGPT tab/operator runs the system.
- `ops/HANDOFF.md` - exact current continuation state.
- `ops/STATUS.md` - current truth/state card.
- `ops/BUILD_PLAN.md` - living implementation plan and phase map.
- `ops/UPGRADE_LIST.md` - ranked next upgrades.
- `ops/RECEIPT.md` - latest compact mission receipt.
- `ops/DECISIONS.md` - durable architecture/product decisions.
- `ops/RUNBOOK.md` - recovery and operational procedures.

## Setup docs

- `docs/ARCHITECTURE.md` - concise system architecture.
- `docs/RENDER_SETUP.md` - Render service/env setup checklist.
- `docs/render-blueprint.example.yaml` - example Render Blueprint to copy into root later as `render.yaml` once app code exists.
- `docs/CHATGPT_APP_SETUP.md` - ChatGPT custom app/MCP connection notes.
- `docs/SECURITY.md` - boundaries, approvals, and forbidden actions.
- `docs/LICENSING.md` - non-permissive licensing posture and approval rule.

## Build law

No generic remote shell. No hidden authority. No local models. No dashboard-first workflow. No document forest in root. The normal path is a bounded mission packet executed by a deterministic worker and proven by CI.
