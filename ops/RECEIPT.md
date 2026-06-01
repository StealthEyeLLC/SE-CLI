# Receipt

## Mission

M-2026-06-01-005: Lock no-API-charge autonomy constraint.

## Date

2026-06-01

## Actor

ChatGPT through SE-CLI MCP bootstrap writer.

## Branch

`main`

## PR

None.

## Files changed

- `docs/NO_API_CHARGE_ARCHITECTURE.md`
- `ops/DECISIONS.md`
- `ops/BUILD_PLAN.md`
- `ops/UPGRADE_LIST.md`
- `ops/HANDOFF.md`
- `ops/STATUS.md`
- `ops/RECEIPT.md`

## What changed

The no-API-charge autonomy constraint was added and aligned across the operating docs.

The durable rule is now:

- ChatGPT is the only reasoning model.
- SE-CLI must not require OpenAI API usage, token-metered model calls, paid background model agents, API-side reasoning controllers, or hidden billable model loops.
- The server may continue deterministic approved work.
- Novel reasoning or novel repair waits for ChatGPT through the user's existing ChatGPT experience.
- Optional ChatGPT Task heartbeat may be used only if available inside the user's plan and not API-billed.

## Verification performed

SE-CLI MCP bootstrap writer was used successfully for the doc updates.

Previously verified runtime tools remain:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`

## CI result

Not configured yet.

## Render result

No Render runtime change was required for this documentation alignment. The existing Render MCP runtime remains the active bridge.

## Risk notes

Low risk. Documentation and planning alignment only. No worker execution, DB/queue requirement, production Blueprint, workflow, credential, license change, or broad write tool was added.

## Next action

Start P2A/U004: add app/server envelopes, build-list/mission/job/result schemas, authority classes, failure classes, policy verdict fixtures, and deterministic continuation contracts before packet/worker execution or broad write tools are added.
