# Status

## State Card

- Mission: M-2026-06-01-003, Verify Render-hosted read-only MCP tools
- Mode: read-only-mcp-verified-next-policy-core
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live service at `https://se-cli-mcp.onrender.com` running `real-mcp-read-only`
- Last action: verified SE-CLI MCP tools `se.get_state_card`, `se.read_handoff`, `se.read_build_plan`, `se.read_upgrade_list`, and `se.read_latest_receipt`
- Next action: start P2/U003 schemas and normal/elevated mission policy tests
- Blocked: no
- Needs approval: normal mission approval for P2 implementation work
- Risk: low
- Updated: 2026-06-01

## Current truth

SE-CLI now has the operating documentation spine, root `AGENTS.md`, a living build plan, a minimal TypeScript workspace, and a Render-hosted MCP runtime. The runtime is read-only and verified through ChatGPT custom app/MCP. It exposes:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`

The Docker runtime image copies `ops/` into `/app/ops`, so the read tools can read the operational docs from Render.

## Tool exposure note

During ChatGPT connector/app refreshes or Render redeploy checks, the SE-CLI tool namespace may disappear when GitHub is also enabled. The observed workaround is to have the user turn GitHub off and expose SE-CLI only, then retry. Do not assume the MCP server is broken until this has been checked.

## Missing runtime pieces

- schema and policy core
- local worker
- work packet protocol implementation
- Postgres migrations
- GitHub Actions CI
- production Render Blueprint in root
- GitHub and Render adapters
- write-capable MCP tools

## Next build target

P2/U003: Add schemas and normal/elevated mission policy tests before any write/execution tools are added.
