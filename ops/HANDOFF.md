# Handoff

## Current mission

M-2026-06-01-006: Align docs with MCP control-plane upgrades.

## Current branch

`main`

## Current PR

None.

## Current State Card

- Mission: M-2026-06-01-006, Align docs with MCP control-plane upgrades
- Mode: control-plane-docs-current-next-p2a
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live service at `https://se-cli-mcp.onrender.com` running MCP runtime with routine update lanes
- Last action: documented thin-app/MCP control-plane upgrades, routine batch update lane, and P2A contract target
- Next action: start P2A/U005 core envelopes, schemas, policy verdicts, and continuation contracts
- Blocked: no
- Needs approval: normal mission approval for P2A implementation work
- Risk: low
- Updated: 2026-06-01

## Last completed action

The docs were updated around the real MCP/control-plane build model:

- ChatGPT is the conversation brain.
- The ChatGPT app stays thin.
- The SE-CLI server owns state, missions, build lists, packets, continuation, integrations, and result packets.
- Workers are deterministic execution appliances.
- GitHub PRs and CI are the review/proof surface.
- New tabs resume from SE-CLI state and operating docs.
- Routine update lanes exist only as bootstrap bridges until the packet/worker path exists.

## Current live tools

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`
- `se.apply_file_batch`

## Connector exposure note

If ChatGPT stops showing SE-CLI tools during a redeploy or reset check, the observed workaround is: user turns GitHub off, exposes SE-CLI only, and asks the assistant to retry. Do not treat the server as broken until this connector visibility issue has been ruled out.

## Next safest action

Start P2A/U005 as a normal mission:

1. Add or expand `packages/se-schemas`.
2. Add or expand `packages/se-policy`.
3. Define app/server envelopes.
4. Define build-list, mission, job, worker, result-packet, boundary-request, authority-class, failure-class, policy-verdict, continuation-decision, and reasoning-requirement contracts.
5. Add fixtures for allowed, elevated, blocked, invalid, clear continuation, needs-review, and needs-user cases.
6. Add tests proving classification and validation behavior.
7. Keep broad execution tools out of scope.

## Open risks

- Worker is not implemented yet.
- CI is not configured yet.
- DB/queue are not configured yet.
- GitHub and Render adapters are not implemented yet.
- Final mission-level write tools do not exist yet.

## Do not do

- Do not expose generic command execution.
- Do not add worker execution before packet contracts exist.
- Do not require DB/queue for P2A.
- Do not add local model dependencies.
- Do not create dashboard-first workflow.
- Do not treat ChatGPT memory as authoritative state.
