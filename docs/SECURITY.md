# Security

SE-CLI is designed to minimize approval spam without hiding authority.

## Core security rule

Use honest, bounded authority. Compress approvals by batching safe work into mission packets, not by making tool descriptions vague or misleading.

## Normal mission wording

> Start a bounded SE-CLI mission. This may create or edit files on a mission branch, run the listed validation commands, push the branch, and open or update a PR. It will not touch secrets, billing, protected branches, destructive deletes, production deployment, or workflow permissions unless separately approved.

## Forbidden default capabilities

The normal mission envelope forbids:

- generic shell execution
- unbounded model-generated command streams
- protected branch mutation
- secret access
- billing changes
- production deployment
- destructive deletion
- workflow permission edits
- license changes
- external publication
- installing unknown global software
- `curl | sh` or equivalent pipe-to-shell patterns
- GitHub issue/PR/comment text flowing directly into privileged scripts

## Allowed normal capabilities

A normal mission may:

- create/edit files in allowlisted paths
- create generated files
- run allowlisted validation commands
- create a mission branch
- commit changes
- push the mission branch
- open/update a PR
- read CI status
- update compact operational docs
- write durable non-secret mission state

## Work packet requirements

A packet must include:

- mission id
- target repo
- base branch
- target mission branch
- allowed paths
- allowed commands
- expected preimage hashes
- packet hash
- validation commands
- receipt template
- risk class
- idempotency key

The worker must verify policy before execution.

## Path policy

Allowed by default once runtime code exists:

- `apps/**`
- `packages/**`
- `ops/**`
- `docs/**`
- `scripts/**`
- `tests/**`
- `storage/migrations/**`

Elevated only:

- `.github/workflows/**`
- `render.yaml`
- auth/security configuration
- deployment configuration
- license files

Forbidden by default:

- `.env`
- `.env.*`
- files containing secrets/tokens/keys
- `.git/**`
- `node_modules/**`
- generated build outputs unless explicitly allowed

## Command policy

Allowed by default after implementation:

- `node --version`
- `pnpm --version`
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm verify`
- `git status`
- `git diff`
- `git add`
- `git commit`
- `git push` to mission branch only
- `gh pr create`
- `gh pr edit`
- `gh pr view`
- `gh run list`

Forbidden by default:

- pipe-to-shell network commands
- unknown global installers
- destructive recursive deletion
- `git push origin main`
- secret management commands
- workflow enable/disable commands
- Render service deletion
- billing/payment commands

## Secret handling

Secrets must live only in proper secret stores:

- Render environment variables or secret files
- GitHub Actions secrets
- local worker OS/user secret store if needed later

Secrets must not appear in:

- prompts
- packets
- committed files
- receipts
- handoffs
- logs
- screenshots
- generated docs

## GitHub safety

- Use mission branches and PRs for serious work.
- Keep `main` protected once CI exists.
- Use least-privilege workflow permissions.
- Treat workflow edits as elevated missions.
- Do not run privileged workflows from untrusted text.

## Render safety

- Do not use Render disk as authoritative mission state.
- Keep secrets in Render env vars/env groups, not in repo.
- Use Postgres for durable mission/memory state.
- Use Key Value/Valkey or Postgres-backed queue for queues/leases.
- Treat production deployment as elevated unless the mission explicitly permits it.

## Incident response

If unsafe behavior is detected:

1. Stop the mission.
2. Record a sanitized event.
3. Do not repeat secrets in chat.
4. Rotate exposed credentials outside the repo.
5. Add prevention work to `ops/UPGRADE_LIST.md`.
6. Resume only after the boundary is clear.
