# Handoff

## New-tab starting point

Continue from `ops/STATUS.md`, `ops/RECEIPT.md`, and this file.

## Current mission

M-2026-06-01-010: new-tab handoff and service-surface check.

## Current branch

`main`

## Current PR

None.

## Current state

- P2A is complete and green in the GitHub UI.
- SE-CLI is reachable from ChatGPT.
- The live tool list still shows the earlier 7-tool surface.
- The newer proof/status tools are committed in the repo but are not visible yet.
- P2B has not started.

## Live tools currently visible

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`
- `se.apply_file_batch`

## Expected newer tools after service refresh

- `se.get_ic_status`
- `se.get_service_status`
- `se.get_proof_packet`

## Soft diagnosis

This looks like the hosted MCP service has not yet refreshed to the newer proof/status surface. Treat it as a service refresh/deploy-status item, not as a reason to redo P2A.

Repo-side notes:

- `apps/mcp-server/src/control.ts` contains the newer proof/status tool definitions.
- `apps/mcp-server/scripts/allow-ci-path.mjs` wires those tools into the MCP server during package build.
- `apps/mcp-server/package.json` runs that helper before TypeScript compilation.

## Next action

1. Check the Render-side status for the `se-cli-mcp` service.
2. Confirm which commit/revision is currently live.
3. Refresh ChatGPT tools again.
4. If the three newer tools appear, call `se.get_proof_packet` and update the ops notes.
5. Start P2B only after this service-surface question is resolved or clearly understood.

## P2B target after unblock

P2B should add the build-list engine skeleton only:

- build list helpers
- item dependency/status helpers
- next unblocked item selection
- pause/resume/skip/retry helpers
- progress counters
- tests

Do not add worker execution. Do not add a generic shell tool.
