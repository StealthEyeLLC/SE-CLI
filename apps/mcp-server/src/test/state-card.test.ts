import test from "node:test";
import assert from "node:assert/strict";
import { createStateCard } from "@stealtheye/se-core";

test("createStateCard returns the P1A read-only MCP state", () => {
  const card = createStateCard(new Date("2026-06-01T00:00:00.000Z"));

  assert.equal(card.service, "se-cli-mcp");
  assert.equal(card.mode, "real-mcp-read-only");
  assert.equal(card.blocked, false);
  assert.equal(card.risk, "low");
  assert.match(card.next_action, /se\.get_state_card/);
  assert.equal(card.updated_at, "2026-06-01T00:00:00.000Z");
});
