# Handoff

## Current mission

M-2026-06-01-003: Verify Render-hosted read-only MCP tools.

## Current branch

`main`

## Current PR

None.

## Current State Card

- Mission: M-2026-06-01-003, Verify Render-hosted read-only MCP tools
- Mode: read-only-mcp-verified-next-policy-core
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live service at `https://se-cli-mcp.onrender.com` running `real-mcp-read-only`
- Last action: verified `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, and `se.read_latest_receipt`
- Next action: start P2/U003 schemas and normal/elevated mission policy tests
- Blocked: no
- Needs approval: normal mission approval for P2 implementation work
- Risk: low
- Updated: 2026-06-01

## Last completed action

The Render-hosted SE-CLI MCP server is connected to ChatGPT and verified. The read-only MCP tool surface can read the State Card and operating docs from the Render runtime.

## Connector exposure note

If ChatGPT stops showing SE-CLI tools during a redeploy or reset check, the observed workaround is: user turns GitHub off, exposes SE-CLI only, and asks the assistant to retry. Do not treat the server as broken until this connector visibility issue has been ruled out.

## Next safest action

Start P2/U003 as a normal mission:

1. Add schema package/foundation if needed.
2. Define the core data contracts for State Card, Mission, Job, Work Packet, Receipt, Handoff, Upgrade Item, Worker Heartbeat, and approval classes.
3. Add policy fixtures for allowed and disallowed mission shapes.
4. Add tests proving allowed fixtures pass and disallowed/elevated fixtures are rejected or escalated.
5. Keep all MCP tools read-only; do not add write tools yet.

## Open risks

- Worker is not implemented yet.
- CI is not configured yet.
- DB/queue are not configured yet.
- GitHub and Render adapters are not implemented yet.
- Write-capable MCP tools do not exist yet.

## Do not do

- Do not expose write-capable MCP tools before schemas and policy gates exist.
- Do not add generic command execution.
- Do not require DB/queue for P2.
- Do not add local model dependencies.
- Do not create dashboard-first workflow.
- Do not treat ChatGPT memory as authoritative state.
