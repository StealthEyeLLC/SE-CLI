# Status

## State Card

- Mission: M-2026-06-01-010, New-tab handoff and control-surface recovery
- Mode: p2a-verified-green-control-tools-pending-live-deploy
- Branch: main
- PR: none
- IC: green in GitHub UI after P2A repair
- Worker: not implemented yet
- Service: live at `https://se-cli-mcp.onrender.com`, but still exposing the old 7-tool MCP surface at last check
- Last action: P2A schema/policy contracts were implemented and verified green; proof/status control code was committed but was not live through SE-CLI at last check
- Next action: in a new tab, refresh tools and check whether `se.get_ic_status`, `se.get_service_status`, and `se.get_proof_packet` are visible; if not, treat it as a service deploy/rebuild issue before P2B
- Blocked: partially; P2A is verified, but new proof-control tools are pending live deploy
- Needs approval: none for check/redeploy recovery; normal mission approval before P2B implementation
- Risk: normal
- Updated: 2026-06-01

## Current truth

P2A is implemented and verified green. The failing policy test was repaired by adding `packages/se-policy/scripts/refine.mjs` and wiring it into `packages/se-policy/package.json`.

The GitHub UI showed the integrated check green after repair. The ChatGPT GitHub connector was unreliable for run/status discovery, returning empty arrays even while the UI showed real activity.

SE-CLI is reachable, but at last check the live service exposed only these 7 tools:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`
- `se.apply_file_batch`

Committed but not live at last check:

- `apps/mcp-server/src/control.ts`
- `apps/mcp-server/scripts/allow-ci-path.mjs` wiring update

Expected after successful service redeploy:

- `se.get_ic_status`
- `se.get_service_status`
- `se.get_proof_packet`

## Key commits

- `52825a88e2cea40d226f99d2e697c16bf280b81e` - P2A policy repair
- `9f7c65e7044df66d5805a32f5e25d43b9bf0858d` - add proof/service control module
- `4cce887dca5628f78bcdea2a309a8a9307cd76cf` - wire proof tools into MCP build patcher

## Do next

1. Start a new tab.
2. Refresh tools.
3. Prefer SE-CLI only if connector visibility gets confused.
4. Call `se.get_state_card`.
5. Check whether the three new proof tools are visible.
6. If visible, call `se.get_proof_packet` and update docs from the result.
7. If not visible, recover the service deploy first.
8. Once proof tools are live or deploy issue is understood, begin P2B: build-list engine skeleton.

## Do not do next

- Do not redo P2A.
- Do not fight the ChatGPT GitHub connector for authoritative check status.
- Do not start broad worker execution yet.
- Do not add a generic shell tool.
- Do not treat ChatGPT memory as authoritative; use repo docs as handoff state.
