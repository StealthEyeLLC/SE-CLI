# Status

## State Card

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

## Current truth

SE-CLI now has the operating documentation spine, root `AGENTS.md`, a living build plan, a canonical integrated spec, a minimal TypeScript workspace, and a Render-hosted read-only MCP runtime.

`docs/INTEGRATED_SPEC.md` is the canonical v1.0 target architecture. The locked model is:

- ChatGPT is the natural-language commander, reviewer, repair commander, and summarizer.
- The ChatGPT App/MCP connector is a thin bridge.
- The SE-CLI server is the stateful control plane.
- Build lists and missions are the units of scoped approval.
- Work packets are execution contracts.
- Workers are deterministic execution appliances.
- GitHub PRs are the review surface.
- CI is the proof surface.
- Result packets return to ChatGPT instead of raw log dumps.

The read-only MCP runtime is verified through ChatGPT custom app/MCP. It exposes:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`

## Tool exposure note

During ChatGPT connector/app refreshes or Render redeploy checks, the SE-CLI tool namespace may disappear when GitHub is also enabled. The observed workaround is to have the user turn GitHub off and expose SE-CLI only, then retry. Do not assume the MCP server is broken until this has been checked.

## Missing runtime pieces

- P2A schema and policy foundation
- build-list engine
- mission/job async controller
- packet builder
- local worker
- work packet execution
- Postgres migrations
- GitHub Actions CI
- production Render Blueprint in root
- GitHub and Render adapters
- write-capable MCP tools

## Next build target

P2A/U003: Add app/server envelopes, build-list/mission/job/result schemas, authority classes, failure classes, and policy verdict fixtures before any write/execution tools are added.
