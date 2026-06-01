# Status

## State Card

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

## Current truth

SE-CLI now has the operating documentation spine, root `AGENTS.md`, a living build plan, a canonical integrated spec, a canonical no-API-charge addendum, a minimal TypeScript workspace, and a Render-hosted MCP runtime.

Canonical docs:

- `docs/INTEGRATED_SPEC.md` defines the thin-app autonomy control plane.
- `docs/NO_API_CHARGE_ARCHITECTURE.md` defines the hard no-API-charge constraint.

The locked model is:

- ChatGPT is the natural-language commander, reviewer, repair commander, and summarizer.
- ChatGPT is the only reasoning model.
- The ChatGPT App/MCP connector is a thin bridge.
- The SE-CLI server is the stateful control plane and deterministic continuation engine.
- Build lists and missions are the units of scoped approval.
- Work packets are execution contracts.
- Workers are deterministic execution appliances.
- GitHub PRs are the review surface.
- CI is the proof surface.
- Result packets return to ChatGPT instead of raw log dumps.
- Novel reasoning or novel repair waits for ChatGPT; the server must not use hidden API-side model calls.

Current verified MCP tools:

- `se.get_state_card`
- `se.read_handoff`
- `se.read_build_plan`
- `se.read_upgrade_list`
- `se.read_latest_receipt`
- `se.apply_single_file_update`

`se.apply_single_file_update` is a temporary constrained bootstrap lane for one-file GitHub create/update work. It is not the final mission execution model.

## Tool exposure note

During ChatGPT connector/app refreshes or Render redeploy checks, the SE-CLI tool namespace may disappear when GitHub is also enabled. The observed workaround is to have the user turn GitHub off and expose SE-CLI only, then retry. Do not assume the MCP server is broken until this has been checked.

## Missing runtime pieces

- P2A schema and policy foundation
- deterministic continuation contracts
- build-list engine
- mission/job async controller
- packet builder
- local worker
- work packet execution
- Postgres migrations
- GitHub Actions CI
- production Render Blueprint in root
- GitHub and Render adapters
- broad mission write tools

## Next build target

P2A/U004: Add app/server envelopes, build-list/mission/job/result schemas, authority classes, failure classes, policy verdict fixtures, and deterministic continuation contracts before packet/worker execution or broad write tools are added.
