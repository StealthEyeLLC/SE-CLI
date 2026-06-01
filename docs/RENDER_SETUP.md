# Render Setup

This guide is for the user-owned Render setup. It should be followed after the documentation spine exists and before/while the MCP runtime is implemented.

## Important current status

Runtime code does not exist yet. Do not place a production `render.yaml` in the repo root until the MCP server, Dockerfile, health endpoints, and worker entrypoints exist.

Use `docs/render-blueprint.example.yaml` as the future Blueprint template. Copy it to root as `render.yaml` only during the Render implementation mission.

## Target Render resources

Create these resources in the same Render region.

| Resource | Recommended name | Type | Purpose |
|---|---|---|---|
| MCP server | `se-cli-mcp` | Web Service | ChatGPT-facing MCP/control-plane endpoint |
| Maintenance worker | `se-cli-maintenance` | Background Worker | Queue cleanup, stale lease recovery, status sync |
| Database | `se-cli-db` | Postgres | Durable missions, jobs, memory, receipts, handoffs |
| Queue/cache | `se-cli-kv` | Key Value / Valkey | Queue/cache/lease acceleration |
| Env group | `se-cli-prod` | Environment Group | Shared non-derived environment variables |

## Region

Use one region for all resources. Recommended default: `ohio` or `virginia` for US East proximity.

Do not split the MCP service, Postgres, and Key Value across regions unless there is a specific reason.

## Plan guidance

For early testing, use the lowest paid plans that provide persistence and reliable background service behavior.

Do not rely on free ephemeral behavior for durable mission state. Postgres is the source of truth.

## Web service setup

Create a Render Web Service after the MCP server code exists.

Recommended settings:

- Name: `se-cli-mcp`
- Source: GitHub repo `StealthEyeLLC/SE-CLI`
- Branch: `main`
- Runtime: Docker
- Dockerfile path: `./Dockerfile` or a future app-specific path if the repo becomes a monorepo Docker build
- Health check path: `/healthz`
- Auto deploy: `checksPass` once CI exists; `off` while bootstrapping if preferred
- Environment group: `se-cli-prod`

Required future web endpoints:

- `/healthz` - process is alive
- `/readyz` - dependencies are reachable
- `/status` - compact service status
- `/mcp` - MCP endpoint

The web service must bind to Render's expected host/port behavior. The app should listen on `0.0.0.0` and use `process.env.PORT` with a default of `10000` for local parity.

## Background worker setup

Create a Render Background Worker after the maintenance/queue code exists.

Recommended settings:

- Name: `se-cli-maintenance`
- Source: GitHub repo `StealthEyeLLC/SE-CLI`
- Branch: `main`
- Runtime: Docker
- Command: future worker-maintenance command, for example `pnpm --filter @se/apps-mcp-server maintenance`
- Environment group: `se-cli-prod`

Purpose:

- requeue expired jobs
- quarantine exhausted jobs
- sync GitHub/CI status
- sync Render status
- write status snapshots

Local build workers are separate from this Render background worker. The Render background worker maintains state; local workers execute repository packets.

## Postgres setup

Create Render Postgres:

- Name: `se-cli-db`
- Region: same as MCP service
- Plan: paid/persistent

The app should receive this as:

- `DATABASE_URL`

In a future Blueprint, use `fromDatabase` to inject the connection string.

## Key Value / Valkey setup

Create Render Key Value:

- Name: `se-cli-kv`
- Region: same as MCP service
- Plan: paid/persistent if using it for queue state

Use it for:

- queue acceleration
- lease locks
- heartbeat cache
- short-lived status cache

Do not make it the only durable source of mission truth. Postgres remains authoritative.

App env var:

- `QUEUE_URL` or `REDIS_URL`, depending implementation choice

In a future Blueprint, use `fromService` to inject Key Value host/port or connection values.

## Required Render environment variables

Use Render env vars or environment groups. Do not commit secret values.

### Core runtime

| Key | Example | Secret? | Notes |
|---|---|---:|---|
| `NODE_ENV` | `production` | no | Node runtime mode |
| `SECLI_ENV` | `production` | no | SE-CLI environment name |
| `SECLI_PUBLIC_BASE_URL` | `https://se-cli-mcp.onrender.com` | no | Final Render URL after service exists |
| `SECLI_MCP_PATH` | `/mcp` | no | MCP endpoint path |
| `SECLI_LOG_LEVEL` | `info` | no | Use `debug` only during troubleshooting |
| `SECLI_ALLOWED_REPOS` | `StealthEyeLLC/SE-CLI` | no | Comma-separated repo allowlist |
| `SECLI_DEFAULT_BRANCH` | `main` | no | Default base branch |

### Durable state

| Key | Example | Secret? | Notes |
|---|---|---:|---|
| `DATABASE_URL` | Render-provided | yes | From `se-cli-db` |
| `QUEUE_URL` | Render-provided | yes | From `se-cli-kv` if implementation uses queue URL |
| `REDIS_URL` | Render-provided | yes | Alternative name if queue library expects Redis URL |

### SE-CLI secrets

Generate these as strong random values in Render. Do not place them in docs or repo.

| Key | Secret? | Purpose |
|---|---:|---|
| `SECLI_SESSION_SECRET` | yes | Server/session signing if needed |
| `SECLI_PACKET_SIGNING_SECRET` | yes | Work packet signing/HMAC |
| `SECLI_WORKER_TOKEN_SECRET` | yes | Worker token issuing/verification |
| `SECLI_WEBHOOK_SECRET` | yes | Webhook validation if used |
| `SECLI_ENCRYPTION_KEY` | yes | Optional field encryption key for stored sensitive metadata |

### GitHub integration

Preferred future setup is a GitHub App. Fine-grained PAT can be used temporarily if necessary.

| Key | Secret? | Purpose |
|---|---:|---|
| `GITHUB_APP_ID` | no | GitHub App id |
| `GITHUB_APP_INSTALLATION_ID` | no | Installation id for `StealthEyeLLC/SE-CLI` |
| `GITHUB_PRIVATE_KEY_B64` | yes | Base64-encoded GitHub App private key |
| `GITHUB_WEBHOOK_SECRET` | yes | GitHub webhook verification |
| `GITHUB_TOKEN` | yes | Temporary fallback only; prefer GitHub App |

Minimum future GitHub permissions should be narrow:

- contents read/write for mission branches
- pull requests read/write
- checks/actions read
- metadata read
- workflows write only for elevated missions that explicitly need workflow edits

### Render integration

| Key | Secret? | Purpose |
|---|---:|---|
| `RENDER_API_KEY` | yes | Render API access for deploy/status tools |
| `RENDER_MCP_SERVICE_ID` | no/low | Service id for `se-cli-mcp` |
| `RENDER_MAINTENANCE_SERVICE_ID` | no/low | Service id for `se-cli-maintenance` |
| `RENDER_POSTGRES_ID` | no/low | Database id/reference if needed |
| `RENDER_KEY_VALUE_ID` | no/low | Key Value id/reference if needed |

### ChatGPT/MCP app integration

Exact values depend on the final ChatGPT app setup.

| Key | Secret? | Purpose |
|---|---:|---|
| `SECLI_MCP_AUTH_MODE` | no | `oauth`, `bearer`, or future selected mode |
| `SECLI_MCP_AUDIENCE` | no | Expected audience/client value if needed |
| `SECLI_MCP_ISSUER` | no | Expected issuer if needed |
| `SECLI_MCP_AUTH_SECRET` | yes | Shared secret only if using bearer/shared-secret bootstrap |

## Local worker environment variables

These live on the local worker machine, not Render.

| Key | Example | Secret? | Purpose |
|---|---|---:|---|
| `SECLI_ORCHESTRATOR_URL` | `https://se-cli-mcp.onrender.com` | no | Render MCP/control-plane URL |
| `SECLI_WORKER_ID` | `jamie-main-worker-01` | no | Stable worker id |
| `SECLI_WORKER_TOKEN` | generated | yes | Worker auth token |
| `SECLI_REPO_FULL_NAME` | `StealthEyeLLC/SE-CLI` | no | Repo allowlist check |
| `SECLI_REPO_PATH` | local path | no | Local clone path |
| `GH_TOKEN` | GitHub token | yes | For branch/PR operations if worker uses `gh` |
| `SECLI_WORKER_CLASS` | `local-safe` | no | Worker class |
| `SECLI_WORKER_MAX_CONCURRENCY` | `1` | no | Default one job per repo |

## Manual setup order

1. Connect Render to GitHub.
2. Link repo `StealthEyeLLC/SE-CLI`.
3. Create Postgres `se-cli-db`.
4. Create Key Value `se-cli-kv` if using queue/cache from Render.
5. Create environment group `se-cli-prod`.
6. Add non-secret vars to the env group.
7. Add secret vars directly in Render, using generated values.
8. Wait to create the web service until Dockerfile/MCP code exists, or create it with deploy disabled if you want the shell ready.
9. Wait to create the background worker until maintenance code exists.
10. After runtime exists, copy `docs/render-blueprint.example.yaml` to root as `render.yaml` in an elevated mission.
11. Validate and sync Blueprint.
12. Confirm `/healthz` and `/readyz`.
13. Set `SECLI_PUBLIC_BASE_URL` to the final Render URL.
14. Configure the ChatGPT custom app/MCP server to point to the Render MCP endpoint.

## Future Blueprint policy

`render.yaml` should not be added before app code exists. When added, it should define:

- web service `se-cli-mcp`
- background worker `se-cli-maintenance`
- Postgres `se-cli-db`
- Key Value `se-cli-kv`
- env vars using `fromDatabase`, `fromService`, `generateValue`, or `sync: false`

Do not hardcode secrets in the Blueprint.

## Validation checklist

Before considering Render ready:

- `DATABASE_URL` is set and reachable.
- Queue/Key Value URL is set if used.
- GitHub credentials are present but not overbroad.
- Render API key is present only if deploy/status tools need it.
- `/healthz` returns success.
- `/readyz` confirms DB and queue connectivity.
- `/status` returns a State Card shell.
- `/mcp` is reachable by ChatGPT app setup.
- Render logs do not print secrets.
- Service uses the intended branch.
- Auto deploy is `checksPass` or disabled during bootstrap.

## Do not do

- Do not store secrets in repo files.
- Do not use Render disk as mission memory.
- Do not deploy before CI exists unless explicitly bootstrapping.
- Do not put production `render.yaml` in root until code exists.
- Do not widen GitHub/Render permissions without an elevated mission.
