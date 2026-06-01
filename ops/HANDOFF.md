# Handoff

## Current mission

M-2026-06-01-005: Lock no-API-charge autonomy constraint.

## Current branch

`main`

## Current PR

None.

## Current State Card

- Mission: M-2026-06-01-005, Lock no-API-charge autonomy constraint
- Mode: no-api-charge-locked-next-p2a
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live service at `https://se-cli-mcp.onrender.com` running MCP runtime with constrained bootstrap writer
- Last action: added no-API-charge architecture addendum and aligned operating docs so API-side model continuation is removed
- Next action: start P2A/U004 core envelopes, schemas, policy verdicts, and deterministic continuation contracts
- Blocked: no
- Needs approval: normal mission approval for P2A implementation work
- Risk: low
- Updated: 2026-06-01

## Last completed action

The no-API-charge architecture addendum was added as `docs/NO_API_CHARGE_ARCHITECTURE.md`. The durable rule is now:

- ChatGPT is the only reasoning model.
- SE-CLI must not require OpenAI API usage, token-metered model calls, paid background model agents, API-side reasoning controllers, or hidden billable model loops.
- The server may continue deterministic approved work.
- Novel reasoning or novel repair waits for ChatGPT through the user's existing ChatGPT experience.
- Optional ChatGPT Task heartbeat may be used only if available inside the user's plan and not API-billed.

The temporary `se.apply_single_file_update` bootstrap writer is available for constrained single-file updates while the proper packet/worker system is not ready.

## Connector exposure note

If ChatGPT stops showing SE-CLI tools during a redeploy or reset check, the observed workaround is: user turns GitHub off, exposes SE-CLI only, and asks the assistant to retry. Do not treat the server as broken until this connector visibility issue has been ruled out.

## Next safest action

Start P2A/U004 as a normal mission:

1. Add or expand `packages/se-schemas`.
2. Add or expand `packages/se-policy`.
3. Define app/server envelopes.
4. Define build-list, mission, job, worker, result-packet, boundary-request, authority-class, failure-class, policy-verdict, continuation-decision, and reasoning-requirement contracts.
5. Add fixtures for allowed, elevated, blocked, invalid, deterministic-continue, needs-ChatGPT, and needs-user cases.
6. Add tests proving classification and validation behavior.
7. Keep broad write/execution tools out of scope.
8. Do not introduce OpenAI API/model-call dependencies.

## Open risks

- Worker is not implemented yet.
- CI is not configured yet.
- DB/queue are not configured yet.
- GitHub and Render adapters are not implemented yet.
- Broad mission write tools do not exist yet.

## Do not do

- Do not add API-side model continuation.
- Do not add hidden token-metered reasoning.
- Do not expose broad write-capable MCP tools before schemas and policy gates exist.
- Do not add generic command execution.
- Do not require DB/queue for P2A.
- Do not add local model dependencies.
- Do not create dashboard-first workflow.
- Do not treat ChatGPT memory as authoritative state.
