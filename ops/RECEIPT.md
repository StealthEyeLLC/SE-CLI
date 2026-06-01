# Receipt

## Mission

M-2026-06-01-007: Make SE-CLI read tools GitHub-backed.

## Date

2026-06-01

## Actor

ChatGPT through SE-CLI MCP batch update lane.

## Branch

`main`

## PR

None.

## Files changed

- `apps/mcp-server/src/index.ts`
- `ops/RECEIPT.md`

## What changed

The MCP server was updated so read tools prefer the latest repository content from GitHub when a GitHub token is configured. This prevents `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, and `se.read_latest_receipt` from returning stale Render-baked docs after SE-CLI writes update GitHub.

`se.get_state_card` and `/status` now try to derive their response from the current `ops/STATUS.md` content before falling back to the package default State Card.

Runtime mode was updated to:

- `real-mcp-github-backed-docs`

## Verification performed

Change was applied through the currently live `se.apply_file_batch` routine lane.

Full runtime verification requires Render to redeploy and then these tools should be checked:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`

Expected result: read tools report `source: github` in structured content and return the latest GitHub docs.

## CI result

Not configured yet.

## Render result

Pending Render redeploy.

## Risk notes

Low to moderate. Runtime code changed, but behavior is narrow: docs/status reads now prefer GitHub and fall back to runtime files when GitHub read is unavailable.

## Next action

After Render redeploy, verify the read tools return current docs. Then start P2A/U005: add app/server envelopes, build-list/mission/job/result schemas, authority classes, failure classes, policy verdict fixtures, and continuation contracts before packet/worker execution or final mission-level tools are added.
