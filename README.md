# SE-CLI

SE-CLI is the StealthEye autonomy control plane for ChatGPT-operated build missions.

The operating doctrine is:

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

The user talks to ChatGPT. ChatGPT plans, reviews, summarizes, and sends repair or continuation instructions. A thin ChatGPT App/MCP connector forwards mission-level intent to the SE-CLI control server. The control server owns state, build lists, missions, packets, policy, queueing, integrations, memory, and result compression. Workers execute bounded packets. GitHub and CI prove the result. Structured result packets return to ChatGPT for review and next moves.

## Current repository state

This repository currently contains the operating documentation spine, root `AGENTS.md`, living build plan, canonical integrated spec, and a Render-hosted read-only MCP runtime. Worker execution, write-capable mission tools, durable DB state, CI, and production Render Blueprint files should be added through approved SE-CLI missions.

## Core UX target

The user should normally see only the ChatGPT conversation.

Normal work should require one meaningful mission/build-list approval, not per-file, per-command, or per-click approvals.

## Canonical operating model

1. User gives direction in ChatGPT.
2. ChatGPT reads current state and proposes a bounded mission or build list.
3. User approves the meaningful scope.
4. The thin ChatGPT app forwards intent to the SE-CLI server.
5. SE-CLI creates missions, packets, jobs, and result envelopes.
6. Workers execute bounded packets in isolated branches/worktrees.
7. Workers commit, push, and open/update PRs.
8. GitHub Actions verifies the work.
9. SE-CLI compresses proof/failures into result packets.
10. ChatGPT reviews, summarizes, fixes, continues, or asks for a real boundary decision.

## Agent instructions

- `AGENTS.md` - root cross-agent instruction surface. Any assistant, coding agent, local worker, or future automated tool should read this before planning or changing files.

## Canonical spec

- `docs/INTEGRATED_SPEC.md` - canonical SE-CLI / ChatGPT Thin-App Autonomy Control Plane spec v1.0.

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

No generic remote shell. No hidden authority. No local models. No dashboard-first workflow. No document forest in root. No ChatGPT-facing low-level write/shell/git/deploy primitives. The normal path is approved mission/build-list intent, server-side policy, bounded packets, deterministic workers, PRs, CI proof, and compact result packets back to ChatGPT.
