# Handoff

## New-tab starting point

This repo is ready for a new ChatGPT tab. The current tab is long, so use this file, `ops/STATUS.md`, and `ops/RECEIPT.md` as the handoff source.

## Current mission

M-2026-06-01-010: New-tab handoff and control-surface recovery.

## Current branch

`main`

## Current PR

None.

## Current state

- P2A schema/policy contract layer is implemented.
- P2A verification is green in the GitHub UI after repair.
- The ChatGPT GitHub connector can write/read repo files but is not reliable as the source of truth for integrated-check run discovery.
- SE-CLI is reachable but was still exposing the old 7 tools at last check.
- New proof/status tools were committed but were not live through SE-CLI at last check.
- Render/service deploy status needs to be checked or recovered before relying on those tools.

## Verified P2A content

P2A added or repaired:

- `packages/se-schemas/package.json`
- `packages/se-schemas/tsconfig.json`
- `packages/se-schemas/src/primitives.ts`
- `packages/se-schemas/src/mission.ts`
- `packages/se-schemas/src/result.ts`
- `packages/se-schemas/src/packet.ts`
- `packages/se-schemas/src/boundary.ts`
- `packages/se-schemas/src/index.ts`
- `packages/se-policy/package.json`
- `packages/se-policy/tsconfig.json`
- `packages/se-policy/src/index.ts`
- `packages/se-policy/src/test/policy.test.ts`
- `packages/se-policy/scripts/refine.mjs`

The last P2A failure was the invalid-command test. It was repaired by making command matching exact during package build.

## Control-surface work committed

Added:

- `apps/mcp-server/src/control.ts`

Updated:

- `apps/mcp-server/scripts/allow-ci-path.mjs`

Intended new tools after successful service deploy:

- `se.get_ic_status` - SE-CLI-owned integrated-check status and proof summary
- `se.get_service_status` - SE-CLI-owned public service health/readiness/status and Render metadata when configured
- `se.get_proof_packet` - combined repository and service proof packet

## Live SE-CLI tool state at handoff

Last observed live tools were still only:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`
- `se.apply_file_batch`

This means the service has not yet deployed the committed proof-control build, or the deploy failed before exposing the new tool list.

## Environment expected for full control

The service should eventually have:

- `SECLI_GITHUB_TOKEN`
- `SECLI_GITHUB_REPOSITORY=StealthEyeLLC/SE-CLI`
- `SECLI_GITHUB_BRANCH=main`
- `SECLI_PUBLIC_SERVICE_URL=https://se-cli-mcp.onrender.com`
- `SECLI_RENDER_SERVICE_ID=srv-d8ehlvvavr4c738olbm0`
- `SECLI_RENDER_API_KEY` if Render API status is wanted inside `se.get_service_status`

Do not expose secret values in chat or docs.

## Next-tab procedure

1. Refresh tools.
2. Prefer SE-CLI only if connector visibility becomes confused.
3. Call `se.get_state_card`.
4. Check whether `se.get_ic_status`, `se.get_service_status`, and `se.get_proof_packet` are visible.
5. If visible, call `se.get_proof_packet` and update `ops/STATUS.md`/`ops/RECEIPT.md`.
6. If not visible, recover the service deploy first. The code is committed; the live MCP surface is stale.
7. After the service/proof issue is resolved, begin P2B: build-list engine skeleton.

## P2B target

P2B should add the build-list engine skeleton, not a broad worker or shell system.

P2B should cover:

- build list model helpers
- item dependency/status helpers
- next unblocked item selection
- pause/resume/skip/retry state helpers
- progress counters
- tests

Do not start broad GitHub/Render automation or worker execution before the build-list and mission/job layers are stable.

## Important lessons from this tab

- Use short, neutral tool/file wording when payload filters are sensitive.
- Avoid sending large executable-looking payloads through ChatGPT tool arguments.
- Prefer staged commits for workflow/config/source changes.
- The repo needs SE-CLI-owned proof/status tools because ChatGPT connector status polling was unreliable.
- Build-time write lanes are temporary scaffolding; the end-state adapter should be thin.
