# ChatGPT App / MCP Setup

This file describes how SE-CLI should connect to ChatGPT once the MCP server is deployed on Render.

## Current status

The MCP runtime does not exist yet. This file defines the target setup and environment surface so Render and app setup can be prepared cleanly.

## Target connection

ChatGPT should connect to the Render-hosted MCP endpoint:

- Base URL: value of `SECLI_PUBLIC_BASE_URL`
- MCP path: value of `SECLI_MCP_PATH`, default `/mcp`
- Full endpoint: `SECLI_PUBLIC_BASE_URL + SECLI_MCP_PATH`

Example shape:

`https://se-cli-mcp.onrender.com/mcp`

## Tool design

Use a small, high-level tool surface.

Read tools:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.inspect_mission`
- `se.search_memory`

Main write tool:

- `se.start_next_safe_mission`

Targeted control tools:

- `se.create_mission`
- `se.create_work_packet`
- `se.enqueue_packet`
- `se.cancel_mission`
- `se.retry_job`
- `se.update_handoff`
- `se.update_upgrade_list`
- `se.write_receipt`
- `se.request_render_deploy`

Do not expose a generic shell or unrestricted file-write tool.

## Canonical normal mission wording

> Start a bounded SE-CLI mission. This may create or edit files on a mission branch, run the listed validation commands, push the branch, and open or update a PR. It will not touch secrets, billing, protected branches, destructive deletes, production deployment, or workflow permissions unless separately approved.

## Tool annotation policy

Read tools:

- `readOnlyHint: true`
- `destructiveHint: false`
- `openWorldHint: false`

Normal mission tool:

- `readOnlyHint: false`
- `destructiveHint: false`
- `openWorldHint: true`

Elevated/deploy tools:

- `readOnlyHint: false`
- `destructiveHint: true` when deletion, overwrite, production deploy, or workflow/security mutation risk exists
- `openWorldHint: true`

## Auth modes

The final implementation should prefer proper OAuth or verified bearer-style auth as supported by the Apps SDK and the deployment environment.

Bootstrap env vars reserved for this:

- `SECLI_MCP_AUTH_MODE`
- `SECLI_MCP_AUDIENCE`
- `SECLI_MCP_ISSUER`
- `SECLI_MCP_AUTH_SECRET`

Do not commit auth secrets.

## State ownership

ChatGPT chat context is not authoritative state.

Authoritative state lives in:

- GitHub repo files for code/docs
- Postgres for missions/jobs/events/memory/receipts/handoffs
- GitHub PR/CI for proof state
- Render for deployed MCP service state

## First connection checklist

After MCP runtime exists and is deployed:

1. Confirm `/healthz` is passing.
2. Confirm `/readyz` can reach Postgres and queue/cache.
3. Confirm `/status` returns a State Card shell.
4. Confirm `/mcp` is reachable over HTTPS.
5. Configure the custom ChatGPT app/developer-mode MCP connection to the `/mcp` endpoint.
6. Test read-only tools first.
7. Test `se.get_state_card`.
8. Test handoff/receipt/upgrade-list reads.
9. Only then test a normal write mission with a harmless fixture packet.

## First write test

The first write mission should be tiny and safe:

- create a mission branch
- update a generated fixture file
- run a trivial validation command
- push branch
- open PR
- update receipt/handoff/status

Do not make the first write mission edit workflows, deployment config, secrets, or production behavior.
