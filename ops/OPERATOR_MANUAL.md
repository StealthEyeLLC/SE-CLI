# SE-CLI Operator Manual

This manual is the first file a new ChatGPT tab/operator should read.

## Operating doctrine

SE-CLI runs on one canonical loop:

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans. The MCP control plane records state and creates bounded work packets. Local workers execute packets. GitHub Actions proves the work. Operational docs preserve continuity.

## Startup procedure for a new tab

1. Do not rely on prior chat context.
2. Read `ops/HANDOFF.md`.
3. Read `ops/STATUS.md`.
4. Read `ops/BUILD_PLAN.md`.
5. Read `ops/UPGRADE_LIST.md`.
6. Read `ops/RECEIPT.md`.
7. Inspect the current GitHub PR/CI status if a PR exists.
8. Inspect Render status if the MCP server exists.
9. Continue from the `Next safest action` field.
10. Ask the user only for a real approval boundary.

## User UX law

The user should normally see only the ChatGPT conversation. Terminals, GitHub UI, Render UI, worker logs, and database UI are recovery/debug surfaces, not the normal operating surface.

## Approval classes

### Class 0: read/status

No user approval needed.

Allowed examples:

- read status
- read handoff
- read receipt
- read upgrade list
- read build plan
- read PR/CI status
- read Render status
- search durable memory

### Class 1: normal mission

One mission-level approval.

Canonical wording:

> Start a bounded SE-CLI mission. This may create or edit files on a mission branch, run the listed validation commands, push the branch, and open or update a PR. It will not touch secrets, billing, protected branches, destructive deletes, production deployment, or workflow permissions unless separately approved.

A normal mission may:

- create files in allowlisted paths
- edit files in allowlisted paths
- create generated files
- run allowlisted validation commands
- create a mission branch
- commit changes
- push the mission branch
- open/update a PR
- read CI status
- update `ops/HANDOFF.md`, `ops/STATUS.md`, `ops/BUILD_PLAN.md`, `ops/RECEIPT.md`, and `ops/UPGRADE_LIST.md`
- write compact state/events to durable storage

A normal mission may not:

- access secrets
- change billing
- deploy production
- mutate protected branches directly
- delete non-generated files
- edit workflow permissions
- change license
- publish a public release
- post externally
- install unknown global software
- run pipe-to-shell network commands
- execute unbounded shell text

### Class 2: elevated mission

Explicit approval required with the named elevated capability.

Examples:

- edit `.github/workflows/**`
- edit `render.yaml`
- modify auth/security policy
- modify deployment configuration
- change license
- deploy production
- manage secrets
- delete non-generated files

### Class 3: hard stop

Always stop and ask.

Hard stops:

- secrets, passwords, tokens, API keys
- payments or billing
- production data mutation
- destructive deletion
- legal/compliance commitment
- external publication
- unknown executable downloaded from the internet
- path outside allowlist
- command outside allowlist
- ambiguous product decision

## State Card format

Every status response should reduce to this compact card:

- Mission:
- Mode:
- Branch:
- PR:
- CI:
- Worker:
- Render:
- Last action:
- Next action:
- Blocked:
- Needs approval:
- Risk:
- Updated:

## Worker rule

The worker is not an agent. It is an appliance.

Worker lifecycle:

**lease -> verify -> apply -> test -> commit -> push -> report**

The worker must not plan, infer goals, choose new commands, access secrets, bypass policy, deploy production, or mutate protected branches unless an explicit elevated mission allows it.

## Packet rule

Scripts run only inside bounded work packets. No generic remote shell should be exposed as a ChatGPT-facing tool.

A packet must answer:

1. What is the mission?
2. What branch is allowed?
3. What paths can change?
4. What commands can run?
5. What files are expected before applying?
6. What files are expected after applying?
7. What proves success?
8. What should the receipt say?

## File responsibilities

- `ops/STATUS.md`: what is true right now.
- `ops/HANDOFF.md`: how a new tab continues.
- `ops/BUILD_PLAN.md`: what will be built, in what order, with acceptance criteria.
- `ops/RECEIPT.md`: what just happened.
- `ops/UPGRADE_LIST.md`: what should happen next.
- `ops/DECISIONS.md`: why durable decisions were made.
- `ops/RUNBOOK.md`: how to recover.
- `docs/ARCHITECTURE.md`: system architecture.
- `docs/RENDER_SETUP.md`: Render setup.
- `docs/SECURITY.md`: security and approval boundaries.

## Mission lifecycle

1. Read State Card.
2. Read handoff, build plan, receipt, and upgrade list.
3. Select the next safe upgrade or use the user's requested mission.
4. Define acceptance tests.
5. Classify approval level.
6. Ask for approval only if required.
7. Create mission record.
8. Create work packet.
9. Enqueue worker job.
10. Worker executes packet.
11. Worker pushes branch and opens/updates PR.
12. GitHub Actions proves the result.
13. Update status, build plan, receipt, handoff, and upgrade list.
14. Report final State Card to the user.

## Anti-drift laws

1. No new autonomous coding/planning brain unless explicitly approved.
2. No generic remote shell creep.
3. No dashboard-first workflow.
4. No receipt obesity.
5. No document forest in root.
6. No accidental permission widening.
7. No hidden actions behind soft wording.
8. No ambiguous tool names.
9. No untrusted GitHub issue/PR/comment text flowing directly into privileged scripts.
10. Improve coherence, UX, and reliability before adding new surfaces.
