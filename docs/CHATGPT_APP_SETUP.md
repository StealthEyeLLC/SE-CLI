# ChatGPT App / MCP Setup

This file describes how SE-CLI connects to ChatGPT through a thin app/MCP bridge.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.

## Current status

The Render-hosted MCP runtime is live and read-only. It is connected to ChatGPT and verified.

Current endpoint:

`https://se-cli-mcp.onrender.com/mcp`

Current verified tools:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`

These are bootstrap/read-only tools. The final app surface should move toward mission-level tools with stable envelopes.

## Thin-app rule

The ChatGPT app is a narrow bridge between ChatGPT and the SE-CLI control server.

It should:

- expose a small set of high-level tools
- forward mission/list/status requests to the server
- return structured response envelopes and result packets
- avoid containing serious business logic
- avoid becoming a worker
- avoid low-level filesystem/shell/git/deploy primitives

It should not be a mini IDE, terminal proxy, dashboard replacement, or generic tool bucket.

## Target tool surface

### Read/status tools

- `se.get_state`
- `se.get_build_list`
- `se.get_current_mission`
- `se.get_status`
- `se.get_result`

### Action tools

- `se.start_build_list`
- `se.start_mission`
- `se.continue`
- `se.submit_fix`
- `se.retry_failed`
- `se.pause`
- `se.cancel`
- `se.approve_boundary`

### Diagnostic tool

- `se.diagnose_connector`

## Tools not to expose as primary ChatGPT primitives

Do not expose these as normal ChatGPT-facing tools:

- unrestricted file write
- generic shell
- direct git push
- direct production deploy
- broad browser clicking
- unrestricted credential operations

Low-level operations must happen behind mission, packet, policy, worker, and adapter layers.

## Request envelope target

Every app-to-server command should eventually use a standard envelope:

- `request_id`
- `user_intent`
- `operation`
- `target`
- `approval_context`
- `idempotency_key`
- `chat_summary`
- `expected_response_mode`
- `max_summary_tokens`
- `client_capabilities`

## Response envelope target

Every server-to-ChatGPT response should eventually use:

- `ok`
- `status`
- `message`
- `state`
- `next_action`
- `needs_user`
- `needs_chatgpt`
- `tool_suggestion`
- `result_packet`
- `artifact_links`
- `display_summary`

## Tool annotation policy

Read tools:

- `readOnlyHint: true`
- `destructiveHint: false`
- `openWorldHint: false`

Mission/list tools:

- `readOnlyHint: false`
- `destructiveHint: false` for normal bounded mission/list operations
- `openWorldHint: true`

Boundary/elevated tools:

- `readOnlyHint: false`
- `destructiveHint: true` only where the operation can materially alter protected surfaces or external state
- `openWorldHint: true`

## Auth modes

Read-only bootstrap may stay simple while the runtime is being built. The final implementation should prefer appropriate OAuth or verified bearer-style auth as supported by the Apps SDK and deployment environment.

Reserved env vars:

- `SECLI_MCP_AUTH_MODE`
- `SECLI_MCP_AUDIENCE`
- `SECLI_MCP_ISSUER`
- `SECLI_MCP_AUTH_SECRET`

Do not commit auth secrets.

## State ownership

ChatGPT chat context is not authoritative state.

Authoritative state lives in:

- GitHub repo files for code/docs
- durable database state once implemented
- GitHub PR/CI state once implemented
- Render deployed runtime state
- artifact pointers and result packets once implemented

## Connector visibility note

During reconnects or redeploy checks, ChatGPT may stop exposing SE-CLI tools when GitHub is also enabled. The observed recovery is to turn GitHub off, expose SE-CLI only, and retry. Treat this as a connector visibility issue first, not a server failure.

The future `se.diagnose_connector` tool should make this easier to inspect.

## First write test, later

The first write mission should happen only after schemas, policy gates, packet creation, and worker fixture behavior exist.

It should be tiny and safe:

- create a mission branch
- update generated/fixture or tightly scoped files
- run listed validation
- push branch
- open/update PR
- return a result packet

Do not make the first write mission edit workflows, deployment config, credentials, production behavior, license, or public release surfaces.
