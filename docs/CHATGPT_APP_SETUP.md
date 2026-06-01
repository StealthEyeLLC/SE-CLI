# ChatGPT App / MCP Setup

This file describes how SE-CLI should connect to ChatGPT once the MCP server is deployed on Render.

## Current status

Render bootstrap is live, but the real MCP runtime does not exist yet. The next implementation mission is P1A: replace the placeholder `/mcp` response with a real read-only MCP runtime.

## Target connection

ChatGPT should connect to the Render-hosted MCP endpoint:

- Base URL: value of `SECLI_PUBLIC_BASE_URL`
- MCP path: value of `SECLI_MCP_PATH`, default `/mcp`
- Full endpoint: `SECLI_PUBLIC_BASE_URL + SECLI_MCP_PATH`

Current target shape:

`https://se-cli-mcp.onrender.com/mcp`

## P1A app goal

P1A should make the Render service usable as a real read-only MCP app.

P1A must provide:

- `/healthz`
- `/readyz`
- `/status`
- `/mcp`
- read-only MCP initialize/list-tools behavior
- read-only tool: `se.get_state_card`

P1A must not provide:

- write tools
- worker execution
- work packet execution
- production deploy tools
- generic shell tools
- DB/queue requirement

## Tool design

Use a small, high-level tool surface.

P1A read tool:

- `se.get_state_card`

Later read tools:

- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.inspect_mission`
- `se.search_memory`

Later main write tool:

- `se.start_next_safe_mission`

Later targeted control tools:

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

Normal mission tool, later:

- `readOnlyHint: false`
- `destructiveHint: false`
- `openWorldHint: true`

Elevated/deploy tools, later:

- `readOnlyHint: false`
- `destructiveHint: true` when deletion, overwrite, production deploy, or workflow/security mutation risk exists
- `openWorldHint: true`

## Auth modes

P1A can begin with no user-secrets-dependent app behavior and focus on read-only MCP compatibility. The final implementation should prefer proper OAuth or verified bearer-style auth as supported by the Apps SDK and the deployment environment.

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
- Postgres for missions/jobs/events/memory/receipts/handoffs, once implemented
- GitHub PR/CI for proof state, once implemented
- Render for deployed MCP service state

P1A may use static/mock state derived from repo docs until Postgres exists.

## First connection checklist

After P1A runtime exists and is deployed:

1. Confirm `/healthz` is passing.
2. Confirm `/readyz` passes without requiring DB/queue.
3. Confirm `/status` returns a State Card.
4. Confirm `/mcp` is reachable over HTTPS.
5. Configure the custom ChatGPT app/developer-mode MCP connection to the `/mcp` endpoint.
6. Test MCP initialize/list-tools.
7. Test `se.get_state_card`.
8. Do not test write tools because none should exist yet.

## First write test, later

The first write mission should happen only after packet creation and policy gates exist.

It should be tiny and safe:

- create a mission branch
- update a generated fixture file
- run a trivial validation command
- push branch
- open PR
- update receipt/handoff/status

Do not make the first write mission edit workflows, deployment config, credentials, or production behavior.
