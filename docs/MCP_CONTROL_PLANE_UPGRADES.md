# MCP Control Plane Upgrades

Status: active architecture note.

This file records the current SE-CLI thin-app to MCP/control-server build model.

## Core shape

User -> ChatGPT -> thin ChatGPT App/MCP bridge -> SE-CLI control server -> build list, missions, packets, workers, GitHub, CI, Render -> result packet -> ChatGPT.

ChatGPT remains the conversation brain. The ChatGPT app stays thin. The SE-CLI server becomes the execution body and state owner. Workers do bounded execution. GitHub and CI provide review and proof. Results return to ChatGPT as compact structured packets.

## Main upgrade

SE-CLI is no longer just a read-only status bridge. It is being built into a control plane with these layers:

1. Thin ChatGPT-facing MCP tool surface.
2. Server-owned state and continuation.
3. Executable build-list structure.
4. Mission DAG and async job model.
5. Bounded packet creation.
6. Worker lease, execute, report loop.
7. GitHub branch and PR automation.
8. CI watch and failure compression.
9. Render health/readiness/status integration.
10. Result packets for ChatGPT review and repair.
11. Durable handoff so new tabs can resume.

## Thin app rule

The ChatGPT app should expose mission-level tools, not tiny filesystem or terminal controls.

Target tools:

- `se.get_state`
- `se.get_build_list`
- `se.get_current_mission`
- `se.start_build_list`
- `se.start_mission`
- `se.continue`
- `se.submit_fix`
- `se.get_status`
- `se.get_result`
- `se.pause`
- `se.cancel`
- `se.approve_boundary`
- `se.diagnose_connector`

The app forwards intent. The server owns the real logic.

## Server duties

The SE-CLI server owns:

- mission state
- build-list state
- work packets
- policy checks
- queue state
- worker leases
- result packets
- failure classes
- boundary requests
- GitHub integration
- CI status reading
- Render status reading
- artifacts and durable handoff

## Worker duties

Workers are deterministic execution appliances. They lease a job, verify the packet, prepare a workspace, apply packet contents, run allowed validation, commit, push, open or update PRs, and report a structured result.

Workers do not choose product direction, widen scope, or invent new commands.

## Build-list execution

The build list is an executable project plan. Each item should include:

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
- status
- result pointer
- next-item behavior

The server should be able to select the next unblocked item, create a mission, build a packet, dispatch work, watch proof, record the result, and continue when safe.

## Result packets

Result packets are the normal ChatGPT review surface. They should include:

- mission ID
- job ID
- build-list item ID
- status
- compact summary
- files changed
- commands run
- tests/checks run
- PR reference
- CI status
- artifact pointers
- failure class
- recommended next action
- whether ChatGPT or user input is needed

Raw logs should be stored as artifacts and summarized, not pasted into ChatGPT by default.

## Continuation

Continuation has three states:

1. Continue mechanically when the current state is clear and approved.
2. Return to ChatGPT when review or repair reasoning is needed.
3. Stop for the user when a real boundary or product decision is needed.

The server should never depend on a prior chat tab to know what is running or what happened.

## Current bootstrap tools

Current live tools are a bridge toward the final surface:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`
- `se.apply_file_batch`

The write lanes are bootstrap conveniences for ordinary bounded repository updates while the full packet/worker path is being built.

## Next implementation target

P2A should define the contracts that the final system depends on:

- app request envelope
- server response envelope
- build list
- build-list item
- mission
- authority class
- job
- work packet
- worker lease
- worker capability
- result packet
- boundary request
- policy verdict
- failure class
- continuation decision

After P2A, the next targets are build-list engine, mission/job controller, packet builder, worker fixture execution, GitHub PR loop, CI watch, and continue/fix loop.
