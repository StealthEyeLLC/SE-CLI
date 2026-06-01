# Handoff

## Current mission

M-2026-06-01-008: Add P2A schema and policy contract layer.

## Current branch

`main`

## Current PR

None.

## Current State Card

- Mission: M-2026-06-01-008, Add P2A schema and policy contract layer
- Mode: p2a-implemented-pending-verification
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live service at `https://se-cli-mcp.onrender.com` running MCP runtime with routine update lanes
- Last action: added P2A schema and policy packages with contract types, policy decisions, continuation decisions, and node test fixtures
- Next action: verify build/typecheck/test once execution is available, then repair any TypeScript/runtime issues before moving to P2B
- Blocked: verification pending
- Needs approval: none for verification; normal mission approval for repairs if needed
- Risk: normal
- Updated: 2026-06-01

## Last completed action

P2A contract layer was added through SE-CLI routine update lanes.

Added contract coverage:

- app request envelope
- server response envelope
- build list
- build-list item
- mission
- work packet
- job
- worker lease
- worker capability
- result packet
- boundary request
- policy verdict
- continuation decision
- authority class
- failure class
- review/user requirement concepts

Added policy coverage:

- routine path classification
- routine command classification
- normal mission allowed
- elevated mission requires boundary classification
- out-of-shape path rejected
- out-of-shape command rejected
- passed result can advance next item
- failed result needs review
- user boundary asks user
- result packet has tiny, standard, and artifact views

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

Run or obtain verification for:

1. `pnpm install`
2. `pnpm build`
3. `pnpm typecheck`
4. `pnpm test`

Then repair any TypeScript or test failures. Do not move to P2B until P2A verifies.

## Open risks

- P2A source has not been executed in CI/local runtime yet.
- Worker is not implemented yet.
- CI is not configured yet.
- DB/queue are not configured yet.
- GitHub and Render adapters are not implemented yet.
- Final mission-level write tools do not exist yet.

## Do not do

- Do not start P2B until P2A passes build/typecheck/test.
- Do not expose generic command execution.
- Do not add worker execution before packet contracts are stable.
- Do not require DB/queue for P2A.
- Do not add local model dependencies.
- Do not create dashboard-first workflow.
- Do not treat ChatGPT memory as authoritative state.
