# Decisions

This file records durable decisions. It is not a mission log.

## D001 - ChatGPT remains the primary control surface

- Date: 2026-06-01
- Status: accepted
- Decision: The user operates SE-CLI through natural-language conversation with ChatGPT. Terminals, dashboards, GitHub UI, Render UI, worker logs, and database UI are recovery/debug surfaces, not the normal UX.
- Reason: The target is near-zero friction and no routine user context switching.

## D002 - Operating doctrine is Mission -> Packet -> Worker -> PR -> Proof -> Handoff

- Date: 2026-06-01
- Status: accepted
- Decision: All normal system behavior must fit the canonical loop.
- Reason: This keeps the architecture coherent and prevents agent/tool sprawl.

## D003 - MCP is the control plane, not a generic shell

- Date: 2026-06-01
- Status: accepted
- Decision: The MCP server owns mission state, memory, packet generation, policy gates, status, and integrations. It must not expose generic unrestricted shell execution to ChatGPT.
- Reason: Work packets provide mass-file/script power without turning the system into a remote shell.

## D004 - Local workers execute bounded packets only

- Date: 2026-06-01
- Status: accepted
- Decision: Local workers are deterministic execution appliances. They lease, verify, apply, test, commit, push, and report.
- Reason: The worker should be powerful but not autonomous. ChatGPT plans; workers execute.

## D005 - GitHub Actions is the proof engine

- Date: 2026-06-01
- Status: accepted
- Decision: Serious work is not complete until GitHub Actions proves it.
- Reason: CI is the neutral proof layer and keeps local worker results honest.

## D006 - Render hosts the MCP/orchestrator, not heavy builds

- Date: 2026-06-01
- Status: accepted
- Decision: Render should host the web MCP server, optional background maintenance worker, durable Postgres, and queue/cache. Heavy repo builds should run in local workers or GitHub Actions.
- Reason: Render is the always-on control plane, not the build machine.

## D007 - Strong open-source posture, license pending user confirmation

- Date: 2026-06-01
- Status: pending
- Decision: The intended open-source posture is non-permissive/strong copyleft, likely AGPL-3.0-only, but the final license file should not be added until the user explicitly approves the license text.
- Reason: Licensing is a durable legal/product decision and should not be silently finalized.

## D008 - Integrated thin-app autonomy control plane spec is canonical

- Date: 2026-06-01
- Status: accepted
- Decision: `docs/INTEGRATED_SPEC.md` is the canonical v1.0 target architecture for SE-CLI unless superseded by a later explicit decision.
- Reason: The integrated spec aligns the user experience, thin ChatGPT app, control server, build-list execution, packets, workers, GitHub/CI proof, durable state, continuation, and result-packet loop into one coherent system.

## D009 - The ChatGPT App is a thin bridge

- Date: 2026-06-01
- Status: accepted
- Decision: The ChatGPT-facing app should expose high-level mission/list/status/result tools and should not own serious business logic or become a filesystem/shell/git/deploy surface.
- Reason: Keeping the app thin reduces approval friction and keeps state, policy, and execution coordination in the server.

## D010 - Build lists are executable project structure

- Date: 2026-06-01
- Status: accepted
- Decision: Build lists should become executable structures with item status, dependencies, scope, allowed paths, allowed commands, proof requirements, stop conditions, and continuation behavior.
- Reason: This allows large projects to run as many bounded missions rather than one vague mega-task.

## D011 - Result packets are the ChatGPT review surface

- Date: 2026-06-01
- Status: accepted
- Decision: Workers/server components should return compact result packets with summaries, changed files, commands/tests, PR/CI references, artifact pointers, failure class, recommended next action, and boundary needs.
- Reason: ChatGPT should review and repair from structured results, not giant raw log dumps.
