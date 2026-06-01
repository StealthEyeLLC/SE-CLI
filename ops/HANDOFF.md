# Handoff

## Current mission

M-2026-06-01-004: Integrate autonomy control plane spec v1.0.

## Current branch

`main`

## Current PR

None.

## Current State Card

- Mission: M-2026-06-01-004, Integrate autonomy control plane spec v1.0
- Mode: integrated-spec-locked-next-p2a
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live service at `https://se-cli-mcp.onrender.com` running `real-mcp-read-only`
- Last action: added canonical integrated spec and aligned core docs around thin-app/control-server/worker/result-packet architecture
- Next action: start P2A/U003 core envelopes, schemas, authority classes, failure classes, and policy verdict fixtures
- Blocked: no
- Needs approval: normal mission approval for P2A implementation work
- Risk: low
- Updated: 2026-06-01

## Last completed action

The integrated SE-CLI / ChatGPT Thin-App Autonomy Control Plane spec v1.0 was added as `docs/INTEGRATED_SPEC.md`. Core docs were aligned so the target model is coherent:

- ChatGPT is the natural-language commander/reviewer.
- The ChatGPT App/MCP connector is thin.
- The SE-CLI server owns state, missions, packets, queues, integrations, and result compression.
- Workers are deterministic execution appliances.
- GitHub PRs and CI provide review/proof.
- Result packets return to ChatGPT for review, repair, and continuation.

## Connector exposure note

If ChatGPT stops showing SE-CLI tools during a redeploy or reset check, the observed workaround is: user turns GitHub off, exposes SE-CLI only, and asks the assistant to retry. Do not treat the server as broken until this connector visibility issue has been ruled out.

## Next safest action

Start P2A/U003 as a normal mission:

1. Add or expand `packages/se-schemas`.
2. Add or expand `packages/se-policy`.
3. Define app/server envelopes.
4. Define build-list, mission, job, worker, result-packet, boundary-request, authority-class, failure-class, and policy-verdict contracts.
5. Add fixtures for allowed, elevated, blocked, and invalid mission shapes.
6. Add tests proving classification and validation behavior.
7. Keep all MCP tools read-only; do not add write tools yet.

## Open risks

- Worker is not implemented yet.
- CI is not configured yet.
- DB/queue are not configured yet.
- GitHub and Render adapters are not implemented yet.
- Write-capable MCP tools do not exist yet.

## Do not do

- Do not expose write-capable MCP tools before schemas and policy gates exist.
- Do not add generic command execution.
- Do not require DB/queue for P2A.
- Do not add local model dependencies.
- Do not create dashboard-first workflow.
- Do not treat ChatGPT memory as authoritative state.
