# Handoff

## Current mission

M-2026-06-01-002: Replan next build as Render-first MCP vertical slice.

## Current branch

`main`

## Current PR

None.

## Current commit

Docs/planning commits are being committed directly during initial repository setup. Future implementation missions should use mission branches and PRs once the work-packet/worker loop exists.

## Current State Card

- Mission: M-2026-06-01-002, Replan next build as Render-first MCP vertical slice
- Mode: plan-updated-render-first
- Branch: main
- PR: none
- CI: not configured yet
- Worker: not implemented yet
- Render: live bootstrap service at `https://se-cli-mcp.onrender.com`
- Last action: updated build plan and upgrade list to make P1A the next mission
- Next action: start P1A normal mission to build the real read-only MCP runtime on Render
- Blocked: no
- Needs approval: normal mission approval for implementation work
- Risk: low
- Updated: 2026-06-01

## Last completed action

The build plan was corrected from broad scaffold-first to Render-first. The next build is now P1A: a minimal TypeScript MCP app on Render with stable `/healthz`, `/readyz`, `/status`, `/mcp`, and read-only `se.get_state_card`.

## Next safest action

Start P1A normal mission:

1. Add minimal TypeScript scaffold.
2. Add `apps/mcp-server` real app.
3. Keep `/healthz`, `/readyz`, and `/status` stable.
4. Replace placeholder `/mcp` with real read-only MCP runtime.
5. Add `se.get_state_card` read-only tool.
6. Update Dockerfile to start the real app.
7. Keep DB/queue optional for now.
8. Deploy to Render and verify endpoints.

## Open risks

- Real MCP runtime does not exist yet.
- `/mcp` is currently a placeholder endpoint and returns not implemented.
- Worker is not implemented yet.
- CI is not configured yet.
- ChatGPT custom app configuration is not complete yet.

## Do not do

- Do not expose write-capable MCP tools in P1A.
- Do not require DB/queue in P1A.
- Do not add local model dependencies.
- Do not create dashboard-first workflow.
- Do not add broad write permissions before the packet/worker policy layer exists.
- Do not treat ChatGPT memory as authoritative state.
