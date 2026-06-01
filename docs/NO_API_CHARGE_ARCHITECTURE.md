# SE-CLI No-API-Charge Autonomy Architecture

Status: canonical constraint addendum to `docs/INTEGRATED_SPEC.md`.

## Hard rule

SE-CLI must not require OpenAI API usage, token-metered model calls, paid background model agents, or any API-side reasoning loop.

The system may use:

- ChatGPT conversation
- ChatGPT App / MCP connector
- SE-CLI MCP/control server
- Render-hosted server, assuming already accepted
- local workers
- GitHub
- GitHub Actions within available/accepted limits
- scheduled ChatGPT Tasks only if available inside the user's existing ChatGPT plan and not API-billed
- deterministic server logic
- deterministic worker logic

The system must not depend on:

- OpenAI API background mode
- OpenAI API webhooks
- paid API agent controller
- token-metered autonomous reasoning
- hidden billable model loops

## Updated architecture

User -> ChatGPT conversation -> Thin ChatGPT App/MCP bridge -> SE-CLI control server -> deterministic continuation engine -> workers / GitHub / CI / Render -> result packet -> ChatGPT review/fix/continue -> repeat.

ChatGPT is the only reasoning model. The SE-CLI server is the persistent execution body. Deterministic automation keeps approved work moving. Workers, GitHub, CI, and Render perform the real operations. When novel reasoning is needed, the system pauses and returns a compact result packet for ChatGPT to continue without API charges.

## Removed component

Remove the API-side agent/controller lane from the target architecture.

The server must not call an OpenAI API model to decide the next repair, generate novel code fixes, or continue autonomous reasoning in the background.

## Deterministic continuation engine

The server may continue automatically without model calls when the decision is mechanical.

Allowed deterministic continuation:

- start the next approved build-list item after the previous item passes
- mark an item complete after proof passes
- watch CI until pass/fail
- retry known flaky CI according to configured rules
- requeue a job after worker lease expiry
- skip blocked items only when the approved build list explicitly allows continuing unrelated items
- update status and progress
- prepare result packets
- return `needs_chatgpt` when novel reasoning is required
- return `needs_user` when a real authority boundary appears
- pause cleanly when uncertain

The deterministic continuation engine must not invent novel code fixes without ChatGPT or a predeclared deterministic repair recipe.

## ChatGPT-mediated reasoning

All nontrivial reasoning happens when ChatGPT is active through the user's existing ChatGPT experience.

Examples:

- user says continue
- user says fix it
- scheduled ChatGPT Task checks status, if available and not API-billed
- new ChatGPT tab calls SE-CLI state tools
- ChatGPT reads a result packet and sends a repair instruction
- ChatGPT reviews whether to continue, pause, skip, or ask for approval

This preserves mission/list-level approval and avoids API charges.

## Continuation modes without API charges

### Manual resume mode

The user says continue, check status, fix it, build next, or what happened. ChatGPT calls SE-CLI and continues.

### ChatGPT Task heartbeat mode

If available inside the user's current ChatGPT plan, a scheduled task may periodically check SE-CLI and report or continue approved mechanical work. This is optional and must not become an API dependency.

### Deterministic server heartbeat mode

The server may run non-model background checks:

- watch worker leases
- watch CI status
- poll GitHub checks
- poll Render health
- advance mechanical states
- mark completed work
- detect blocked states
- prepare result packets

### No-cost overnight mode

Overnight mode means the server continues through deterministic approved steps, runs workers, watches proof, retries allowed flakes, advances to the next approved mechanical item, stops on novel failures or boundaries, and prepares a summary.

It does not mean unlimited model-generated repair while the user is absent.

## Auto-repair policy

### Deterministic auto-repair

Allowed without model calls when the repair is predeclared and inside approved scope.

Examples:

- run formatter
- regenerate lockfile if allowed
- retry install
- retry flaky CI
- rerun tests after timeout
- apply known codemod
- restore generated files
- rebuild generated schema artifacts
- fix docs freshness with deterministic templates
- rebase/refresh branch if explicitly allowed

### ChatGPT-reasoned repair

Requires ChatGPT to be active.

Examples:

- novel typecheck fix
- test logic correction
- architecture adjustment
- refactor mistake
- ambiguous package design
- new implementation patch
- new code generation
- CI failure requiring interpretation

Flow: failed mission -> server compresses failure -> ChatGPT reads failure -> ChatGPT sends fix instruction -> server builds repair packet -> worker executes -> CI runs -> result returns.

## Updated autonomy definition

With no API charges, all-the-way autonomy means:

- the server owns durable state
- the server owns build-list execution
- the server owns workers, PRs, CI watching, and deterministic continuation
- ChatGPT remains the only model reasoning layer
- ChatGPT can resume from any tab
- user approval is mission/list-level
- mechanical steps continue automatically
- novel reasoning waits for ChatGPT interaction or optional non-API ChatGPT task heartbeat
- no paid API model loop is required

This is slightly less autonomous than an API-controller architecture, but it better matches the no-extra-charge constraint.

## Must build

- authoritative server state
- executable build-list engine
- deterministic continuation engine
- worker lease/execute/report loop
- GitHub PR integration
- CI watcher
- result packet compressor
- ChatGPT continue/fix loop
- optional ChatGPT Task heartbeat
- one-screen state view

## Do not build

- API-side OpenAI controller
- paid model background loop
- token-metered repair agent
- autonomous API webhook continuation
- hidden model calls from the server

## Updated final architecture layers

1. ChatGPT conversation interface
2. Thin ChatGPT App/MCP bridge
3. SE-CLI control server
4. Durable state database
5. Executable build-list engine
6. Deterministic continuation controller
7. Mission controller
8. Packet builder
9. Queue/lease system
10. Worker appliance
11. GitHub adapter
12. CI watcher
13. Render adapter
14. Result compressor
15. Manual resume lane
16. Optional ChatGPT Task heartbeat lane
17. Boundary/decision request system
18. State reconciliation loop

Removed layers:

- API-side model controller
- paid background reasoning
- API webhook continuation

## Practical ceiling

Large projects remain possible. Mechanical work, CI watching, worker execution, PR updates, allowed retries, and next approved items can continue without the user. Novel AI reasoning waits for ChatGPT interaction or an optional ChatGPT Task heartbeat.

The tradeoff is acceptable: the system avoids API charges while preserving large build-list execution, tab recovery, PR/CI proof, structured summaries, and low approval friction.

## Core sentence

ChatGPT is the only reasoning model; the MCP/control server is the persistent execution body; deterministic automation keeps approved work moving; workers, GitHub, CI, and Render perform the real operations; when novel reasoning is needed, the system pauses and returns a compact result packet for ChatGPT to continue without API charges.
