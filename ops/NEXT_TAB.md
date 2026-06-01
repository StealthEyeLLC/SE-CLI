# Next Tab Quick Start

Start here in a new ChatGPT tab.

## First message to send

Read `ops/HANDOFF.md`, `ops/STATUS.md`, and `ops/RECEIPT.md`. Then refresh SE-CLI tools and tell me whether the proof/status tools are live.

## Current summary

- P2A is done and green in the GitHub UI.
- The current live SE-CLI service was still showing the old 7 tools at last check.
- New proof/status tools were committed but were not visible yet.
- The likely blocker is service redeploy/rebuild, not code planning.

## Tools expected if redeploy worked

- `se.get_ic_status`
- `se.get_service_status`
- `se.get_proof_packet`

## If those tools are visible

Call `se.get_proof_packet`, update docs, then start P2B.

## If those tools are not visible

Treat the live service as stale. Check deploy status/logs or force a redeploy. Do not redo P2A.

## Next build phase

P2B: build-list engine skeleton.

Scope:

- build list helpers
- item dependency helpers
- next-item selection
- pause/resume/skip/retry helpers
- progress counters
- tests

Do not build the worker yet. Do not add a generic shell tool. Do not rely on ChatGPT memory as state.
