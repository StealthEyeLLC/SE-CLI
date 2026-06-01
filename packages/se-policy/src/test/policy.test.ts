import assert from "node:assert/strict";
import test from "node:test";
import { decideContinuation, evaluateMissionPolicy } from "../index.js";
import type { MissionV0, ResultPacketV0 } from "@stealtheye/se-schemas";

const now = "2026-06-01T00:00:00.000Z";

function mission(overrides: Partial<MissionV0> = {}): MissionV0 {
  return {
    id: "m1",
    title: "contract fixture",
    goal: "check contract behavior",
    status: "planned",
    authority_class: "normal",
    scope: "schema policy contracts",
    allowed_paths: ["packages/se-schemas/src/index.ts"],
    allowed_commands: ["pnpm build", "pnpm typecheck", "pnpm test"],
    validation_commands: ["pnpm test"],
    base_ref: "main",
    branch_name: "main",
    created_at: now,
    updated_at: now,
    ...overrides
  };
}

function packet(overrides: Partial<ResultPacketV0> = {}): ResultPacketV0 {
  return {
    id: "r1",
    mission_id: "m1",
    job_id: "j1",
    status: "passed",
    tiny_summary: "passed",
    standard_summary: "contract fixture passed",
    files_changed: ["packages/se-schemas/src/index.ts"],
    commands_run: ["pnpm test"],
    checks_run: ["policy.test"],
    artifacts: ["artifact://p2a"],
    failure_class: "none",
    recommended_next_action: "continue",
    needs_user: false,
    needs_review: false,
    confidence: "high",
    created_at: now,
    ...overrides
  };
}

test("normal mission is allowed", () => {
  const verdict = evaluateMissionPolicy(mission());
  assert.equal(verdict.ok, true);
  assert.equal(verdict.decision, "allow");
});

test("elevated mission needs boundary", () => {
  const verdict = evaluateMissionPolicy(mission({ authority_class: "elevated" }));
  assert.equal(verdict.ok, false);
  assert.equal(verdict.decision, "needs_boundary");
});

test("invalid path is rejected", () => {
  const verdict = evaluateMissionPolicy(mission({ allowed_paths: ["../outside.txt"] }));
  assert.equal(verdict.ok, false);
  assert.equal(verdict.decision, "reject");
  assert.deepEqual(verdict.limited_paths, ["../outside.txt"]);
});

test("invalid command is rejected", () => {
  const verdict = evaluateMissionPolicy(mission({ allowed_commands: ["pnpm test && other"] }));
  assert.equal(verdict.ok, false);
  assert.equal(verdict.decision, "reject");
});

test("passed result advances next item", () => {
  const decision = decideContinuation({ result: packet(), next_item_id: "U006" });
  assert.equal(decision.action, "advance_next_item");
  assert.equal(decision.review, "none");
});

test("failed result needs review", () => {
  const decision = decideContinuation({ result: packet({ status: "failed", failure_class: "typecheck" }) });
  assert.equal(decision.action, "request_review");
  assert.equal(decision.review, "review");
});

test("user boundary asks user", () => {
  const decision = decideContinuation({ needs_user: true });
  assert.equal(decision.action, "request_user");
  assert.equal(decision.review, "user");
});

test("result packet has compact standard and artifact views", () => {
  const result = packet();
  assert.ok(result.tiny_summary.length > 0);
  assert.ok(result.standard_summary.length > 0);
  assert.ok(result.artifacts.length > 0);
});
