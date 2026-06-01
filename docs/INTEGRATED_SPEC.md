# SE-CLI / ChatGPT Thin-App Autonomy Control Plane

Integrated Engineering Spec v1.0

## Status

Canonical. This document defines the target operating model for SE-CLI unless superseded by an explicit later decision.

## Core objective

Build a system where the user interacts almost entirely through ChatGPT, approves a bounded mission or build list at meaningful scope, and the external SE-CLI control server handles state, queueing, workers, GitHub, CI, Render checks, continuation, and repair loops with minimal additional user involvement.

The goal is practical delegated autonomy under scoped authority. It is not hidden unlimited autonomy.

## One-sentence architecture

ChatGPT remains the natural-language commander and reviewer; a thin ChatGPT App/MCP connector forwards mission-level intent to the SE-CLI control server; the server owns queue, state, policy, integrations, and result compression; deterministic workers execute bounded packets; GitHub and CI prove results; structured result packets return to ChatGPT for review, repair, and continuation.

## Roles

### User

The user provides product direction, mission or build-list approval, subjective decisions when needed, and authority for credentials, billing, production/public release, destructive actions, or other elevated boundaries.

The user should not normally need to use a terminal, copy files manually, paste logs, click through dashboards, approve every file write, approve every command, babysit CI, manually open PRs, or track state between tabs.

### ChatGPT

ChatGPT is the conversational interface, mission planner, build-list interpreter, reviewer, failure analyst, fix commander, final summarizer, and user-facing explanation layer.

ChatGPT is not the execution engine.

### Thin ChatGPT App / MCP connector

The ChatGPT-facing app is a narrow bridge. It exposes a small, stable set of high-level tools, forwards mission requests to the control server, and returns structured state/result packets.

It must not become a mini IDE, worker, broad filesystem API, or shell surface.

### SE-CLI control server

The control server owns mission state, build-list state, work packets, policy checks, authority boundaries, worker dispatch, queue state, GitHub integration, CI result reading, Render status, artifact pointers, durable memory, handoff state, receipts, repair-loop orchestration, and ChatGPT-facing result formatting.

### Workers

Workers are deterministic execution appliances. They lease jobs, verify packet constraints, create isolated branches or worktrees, apply packet files/patches/scripts, run allowed validation commands, commit, push, open/update PRs, and report structured results.

Workers do not decide product direction, widen scope, add commands not listed in the packet, access credentials unless explicitly granted, or require local AI models.

## Core invariants

1. ChatGPT is the commander/reviewer, not the execution engine.
2. The ChatGPT app is thin.
3. The SE-CLI server is the stateful control plane.
4. Workers are appliances, not planning agents.
5. Missions and build lists are the units of approval.
6. Packets are the execution contracts.
7. GitHub branches/PRs are the review surface.
8. CI is the proof surface.
9. Result packets return to ChatGPT instead of raw logs.
10. Durable server state is authoritative; ChatGPT memory is not.
11. The system stops for real boundaries, not routine file edits or tests.

## Non-goals

This spec does not add local model routing, generic remote shell access, dashboard-first UX, broad plugin surfaces, unbounded agent behavior, extra receipt bureaucracy, per-file approval workflows, or experimental agent research features.

## Approved tool philosophy

The ChatGPT-facing tool surface should stay small and mission-level.

Core read tools:

- `se.get_state`
- `se.get_build_list`
- `se.get_current_mission`
- `se.get_status`
- `se.get_result`

Core action tools:

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

Do not expose ChatGPT-facing `write_file`, `run_shell`, `git_push`, `deploy_prod`, or unrestricted low-level filesystem/browser tools as primary work primitives.

## Approval model

The desired approval envelopes are:

1. Single mission approval.
2. Build-list approval.
3. Build-list-with-normal-authority approval.
4. Repair-loop approval.
5. Continue-until-boundary approval.

The ideal normal approval is: execute the approved build list in order using normal mission authority; continue automatically through passing items; stop for elevated boundaries, unrepaired proof failures, unclear product decisions, missing credentials, billing/payment, destructive actions, public/production authority, or scope expansion.

## Build list as executable structure

A build-list item must include:

- ID
- title
- purpose
- dependencies
- scope
- allowed paths
- allowed commands
- expected outputs
- proof requirements
- stop conditions
- priority
- status
- result pointer
- next-item behavior

The server should be able to select the highest-priority unblocked item, create a mission, create a packet, dispatch a worker, prove the result, mark the item complete, and continue.

## Mission DAG

A mission node may include dependencies, blocks, parallel-safe flag, sequential-only flag, retry policy, repair mission linkage, parent build-list ID, generated child missions, exit criteria, and resume point.

Large projects should be many bounded missions, not one vague mega-task.

## Async job behavior

Every long mission starts as an async job. The server returns mission ID, job ID, queue position, current phase, status reference, expected next status, and whether the user is needed now.

ChatGPT should not hold a long execution inside a single response.

## Continuation modes

The system supports three continuation lanes:

1. Manual resume: the user says continue, check status, fix it, or build next.
2. Scheduled heartbeat: a scheduled check asks the server whether approved work can continue or whether the user must be notified.
3. API controller: an external controller can read result packets and continue approved work until blocked or complete.

All lanes must read the same durable server state.

## Result packet

Every worker/server completion returns a compact result packet with:

- mission ID
- job ID
- build-list item ID
- status
- summary
- files changed
- commands run
- tests run
- PR link
- CI status
- artifact links
- failure classification
- recommended fix
- auto-repair eligibility
- user-input requirement
- next suggested mission
- confidence
- tiny summary for ChatGPT
- full log/artifact pointers

Result packets should have tiny, standard, and full-detail views.

## Failure classes

Failures should be classified before they are shown to ChatGPT. Classes include test failure, typecheck failure, build failure, dependency install failure, Git conflict, CI environment failure, worker crash, Render/runtime failure, missing credential, permission issue, scope violation, ambiguous product decision, rate limit, flaky failure, and unknown failure.

Each class maps to retry eligibility, repair eligibility, ChatGPT analysis need, user-decision need, boundary need, and manual-action need.

## Auto-repair

Normal failed missions may create repair missions automatically when the failure is within approved scope, no new authority is required, paths remain allowed, commands remain allowed, the target is directly related to the failed mission, and the approval envelope allows repair loops.

Auto-repair flow: report failure, compress/classify failure, get ChatGPT/API fix instruction, create repair packet, run worker, rerun validation/CI, return result, continue or block.

## Idempotency

Every mission and packet must be idempotent. Required keys include build-list ID, mission ID, packet ID, idempotency key, input hash, base ref, expected file hashes, and branch name.

Repeated calls should return existing jobs/results rather than duplicate work.

## State resume

Any new ChatGPT tab should call state tools and receive the current build list, current mission, running job, last completed job, last failure, current branch/PR, CI state, next action, whether user approval is needed, and whether continuation is safe.

No previous chat context should be required.

## Connector behavior

Tool list behavior must be deterministic and reconnect-safe. If the ChatGPT client stops exposing SE-CLI tools while GitHub is enabled, the observed recovery is to expose SE-CLI only and retry. Server state must remain unaffected by reconnects.

The server should eventually expose `se.diagnose_connector` for endpoint/tool/status diagnosis.

## Progress view

The system should always be able to show: build-list progress, current mission, current phase, current worker state, current PR, current CI state, last event time, and whether it is safe to continue.

## Boundary requests

When user authority is needed, the server returns a boundary request with type, reason, proposed action, impact, alternatives, recommendation, approval phrase needed, and whether other items can continue.

## Primary loop

1. User approves mission or build list.
2. ChatGPT calls the appropriate SE-CLI tool.
3. Server creates queue run and mission.
4. Server creates work packet.
5. Worker leases packet.
6. Worker applies changes and validates.
7. Worker commits, pushes, and opens/updates PR.
8. CI runs.
9. Server reads CI state.
10. Server marks pass, starts repair, or returns boundary request.
11. ChatGPT summarizes and continues/fixes/stops.

## Implementation phases

1. Stabilize thin bridge and response envelopes.
2. Build list engine.
3. Mission and async job controller.
4. Packet builder.
5. Worker appliance.
6. GitHub PR loop.
7. CI watch and failure compression.
8. Continue/fix/build-list loop.
9. Heartbeat/API continuation lane.
10. Operational polish.

## Whole-system acceptance

The system is successful when the user can approve a build list once, ChatGPT can start it, the server creates missions and packets, workers execute packets, PRs are created/updated, CI is watched, failures are summarized, allowed repairs are attempted, new tabs can resume from server state, restarts/crashes do not lose mission state, repeated calls do not duplicate jobs, ChatGPT receives compact result packets, and the user is interrupted only for meaningful authority or product decisions.

## Final lock

The correct system is not ChatGPT doing everything. The correct system is: ChatGPT understands and reviews; the thin app forwards intent; the control server owns state and execution coordination; build lists become executable project plans; workers perform bounded implementation; GitHub and CI prove results; result packets return to ChatGPT; the loop continues until complete or blocked.

The central rule is to remove approval friction by moving work into approved missions and build lists, not by pretending authority no longer exists.
