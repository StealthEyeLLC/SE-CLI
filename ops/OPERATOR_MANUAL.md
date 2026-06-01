# SE-CLI Operator Manual

This manual is the first operating file a new ChatGPT tab/operator should read after the canonical integrated spec.

Canonical integrated spec: `docs/INTEGRATED_SPEC.md`.

## Operating doctrine

SE-CLI runs on one canonical loop:

**Mission -> Packet -> Worker -> PR -> Proof -> Handoff**

ChatGPT plans, reviews, summarizes, and sends repair or continuation instructions. The thin ChatGPT App/MCP connector forwards mission-level intent. The SE-CLI control server owns state, build lists, missions, packets, policy, queueing, integrations, and result compression. Workers execute bounded packets. GitHub and CI prove the work. Handoff/state makes new-tab continuation possible.

## Startup procedure for a new tab

1. Do not rely on prior chat context as authoritative state.
2. Read `docs/INTEGRATED_SPEC.md`.
3. Read `ops/HANDOFF.md`.
4. Read `ops/STATUS.md`.
5. Read `ops/BUILD_PLAN.md`.
6. Read `ops/UPGRADE_LIST.md`.
7. Read `ops/RECEIPT.md`.
8. Inspect GitHub PR/CI state if a PR exists.
9. Inspect Render status if runtime behavior is relevant.
10. Continue from the `Next safest action` field.
11. Ask the user only for a real approval boundary or product decision.

## Connector visibility note

During reconnects or redeploy checks, ChatGPT may stop exposing SE-CLI tools when GitHub is also enabled. The observed recovery is to have the user turn GitHub off, expose SE-CLI only, and retry. Treat this as a connector visibility issue first, not a server failure.

## User UX law

The user should normally see only the ChatGPT conversation. Terminals, GitHub UI, Render UI, worker logs, and database UI are recovery/debug surfaces, not the normal operating surface.

## Thin-app law

The ChatGPT-facing app is only a bridge. It should expose high-level state/mission/list/result tools, not broad file, shell, git, browser, or deployment primitives.

## Approval classes

### Class 0: read/status

No user approval needed.

Allowed examples:

- read state
- read handoff
- read receipt
- read upgrade list
- read build plan
- read PR/CI status
- read Render status
- inspect connector/runtime diagnostics

### Class 1: normal mission or build list

One meaningful mission/build-list approval.

Canonical wording:

> Start a bounded SE-CLI mission or approved build-list run using normal authority. It may create or edit files in approved paths, run listed validation commands, create/update a mission branch and PR, watch proof, and return result packets. It will stop for credentials, billing, protected surfaces, destructive actions, production/public actions, workflow/security changes, license changes, or unclear product decisions unless separately approved.

A normal mission may:

- create/edit allowlisted files
- create generated files
- run allowlisted validation commands
- create a mission branch
- commit changes
- push the mission branch
- open/update a PR
- read proof status
- return a structured result packet
- update operating docs or durable state when appropriate

A normal mission may not:

- access credential values
- change billing
- deploy production
- mutate protected branches directly
- delete non-generated files
- edit workflow/security/deploy policy without elevated approval
- change license
- publish a public release
- post externally
- execute unbounded command text

### Class 2: elevated mission

Explicit approval required with the named elevated capability.

Examples:

- edit workflow configuration
- edit production deployment configuration
- modify auth/security policy
- change license
- deploy production
- manage credentials
- delete non-generated files

### Class 3: hard stop

Always stop and ask.

Hard stops:

- credential values needed
- payments or billing
- production data mutation
- destructive deletion
- legal/compliance commitment
- external publication
- unknown executable from the internet
- path or command outside approved scope
- ambiguous product decision

## State Card format

Every status response should reduce to this compact card:

- Mission
- Mode
- Branch
- PR
- CI
- Worker
- Render
- Last action
- Next action
- Blocked
- Needs approval
- Risk
- Updated

## Result packet rule

ChatGPT should receive compact result packets, not raw log dumps by default. Each result should include status, summary, files changed, commands/tests run, PR/CI references, artifact pointers, failure class if any, recommended next action, and whether user input or ChatGPT repair is needed.

## Worker rule

The worker is not an agent. It is an appliance.

Worker lifecycle:

**lease -> verify -> prepare workspace -> apply -> validate -> commit -> push -> open/update PR -> report**

The worker must not plan, infer goals, choose new commands, access credentials, bypass policy, deploy production, or mutate protected branches unless an explicit elevated mission allows it.

## Packet rule

Scripts and file changes run only inside bounded work packets. No generic remote shell should be exposed as a ChatGPT-facing tool.

A packet must answer:

1. What is the mission?
2. What branch is allowed?
3. What paths can change?
4. What commands can run?
5. What files/hashes are expected before applying?
6. What files/hashes are expected after applying?
7. What proves success?
8. What should the result packet/receipt say?

## File responsibilities

- `docs/INTEGRATED_SPEC.md`: canonical target operating model.
- `ops/STATUS.md`: what is true right now.
- `ops/HANDOFF.md`: how a new tab continues.
- `ops/BUILD_PLAN.md`: what will be built, in what order, with acceptance criteria.
- `ops/RECEIPT.md`: what just happened.
- `ops/UPGRADE_LIST.md`: what should happen next.
- `ops/DECISIONS.md`: why durable decisions were made.
- `ops/RUNBOOK.md`: how to recover.
- `docs/ARCHITECTURE.md`: concise architecture.
- `docs/CHATGPT_APP_SETUP.md`: thin app/MCP setup.
- `docs/RENDER_SETUP.md`: Render setup.
- `docs/SECURITY.md`: security and approval boundaries.

## Mission lifecycle target

1. Read state.
2. Read handoff, build plan, receipt, and upgrade list.
3. Select the next safe upgrade or use the user's requested mission.
4. Define acceptance tests and approval envelope.
5. Create mission record.
6. Create work packet.
7. Enqueue worker job.
8. Worker executes packet.
9. Worker pushes branch and opens/updates PR.
10. CI proves or fails.
11. Server compresses result into a result packet.
12. ChatGPT reviews result.
13. ChatGPT continues, submits fix, pauses, or asks user for a boundary decision.
14. Update status, build plan, receipt, handoff, and upgrade list when appropriate.
15. Report final State Card or result summary to the user.

## Natural user commands

The system should eventually make these phrases sufficient:

- Build the list.
- Continue.
- Fix it.
- Pause.
- What happened?
- What is blocked?
- What is next?
- Approve normal mission.
- Approve this list.
- Stop after this PR.

## Anti-drift laws

1. No new autonomous coding/planning brain unless explicitly approved.
2. No generic remote shell creep.
3. No dashboard-first workflow.
4. No receipt obesity.
5. No document forest in root.
6. No accidental permission widening.
7. No hidden actions behind soft wording.
8. No ambiguous tool names.
9. No untrusted external text flowing directly into privileged scripts.
10. Improve coherence, UX, and reliability before adding new surfaces.
