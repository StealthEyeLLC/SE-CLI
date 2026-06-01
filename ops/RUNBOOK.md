# Runbook

This file explains how to recover SE-CLI when something interrupts the normal loop.

## Normal loop

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

## Recovery rule

Do not guess from chat memory. Recover from repository docs, GitHub state, Render state, and durable storage.

## New tab recovery

1. Read `ops/HANDOFF.md`.
2. Read `ops/STATUS.md`.
3. Read `ops/RECEIPT.md`.
4. Read `ops/UPGRADE_LIST.md`.
5. Inspect the active PR if one exists.
6. Inspect CI status if a PR exists.
7. Inspect Render status if the MCP server is deployed.
8. Continue from `Next safest action`.

## Render reset recovery

Expected future behavior once runtime exists:

1. MCP server restarts.
2. MCP server reads Postgres state.
3. MCP server checks queued/running jobs.
4. Expired worker leases are requeued or quarantined.
5. MCP server reads GitHub PR/CI state.
6. MCP server reconstructs State Card.
7. MCP server updates `ops/STATUS.md` if needed.

Do not use Render disk as authoritative mission state.

## Worker crash recovery

Expected future behavior once runtime exists:

1. Worker heartbeat stops.
2. Job lease expires.
3. Job becomes `expired`.
4. If attempts remain, job requeues.
5. If attempts are exhausted, job becomes `quarantined`.
6. Handoff records the blocked job and next safest repair action.

## CI failure recovery

1. Do not merge.
2. Do not deploy.
3. Mark mission `blocked` or `failed`.
4. Summarize failing jobs.
5. Add a repair item to `ops/UPGRADE_LIST.md` if the failure is not trivial.
6. Create a repair mission packet.
7. Keep the original branch/PR as the evidence surface.

## Git conflict recovery

1. Worker stops.
2. Worker reports conflicting paths.
3. MCP records a blocked mission event.
4. Assistant summarizes the conflict.
5. If the conflict is mechanical, create a repair packet.
6. If the conflict is product/architecture subjective, ask the user.

## Unsafe packet recovery

If a packet attempts a forbidden action:

1. Worker stops before execution.
2. Packet is marked rejected.
3. Event log records the policy violation.
4. Receipt/handoff note the blocked reason.
5. Assistant proposes a narrower mission or asks for elevated approval if appropriate.

Forbidden by default:

- path outside allowlist
- command outside allowlist
- secret access
- protected branch mutation
- workflow permission edit
- destructive delete
- production deploy
- external publication

## Secret exposure response

If a secret appears in a packet, log, doc, prompt, or commit:

1. Stop the mission.
2. Do not repeat the secret in chat.
3. Remove the secret from files/logs where possible.
4. Rotate the exposed credential outside the repo.
5. Record a sanitized incident note.
6. Add a prevention upgrade to `ops/UPGRADE_LIST.md`.

## Render manual setup recovery

If Render setup fails:

1. Confirm the service is linked to `StealthEyeLLC/SE-CLI`.
2. Confirm service type is web service for MCP, background worker for maintenance, Postgres for durable state, and Key Value for queue/cache.
3. Confirm service region consistency.
4. Confirm Docker runtime after Dockerfile exists.
5. Confirm env vars from `docs/RENDER_SETUP.md`.
6. Confirm web service binds to `0.0.0.0` and expected port.
7. Confirm `/healthz` and `/readyz` endpoints after runtime exists.

## Manual safety fallback

If automation is confused, stop and produce:

- current State Card
- known facts
- blocked reason
- safest next action
- whether approval is required

Do not improvise privileged actions.
