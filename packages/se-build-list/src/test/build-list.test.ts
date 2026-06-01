import assert from "node:assert/strict";
import test from "node:test";
import {
  getBuildListProgress,
  getMissingDependencyIds,
  getNextUnblockedItem,
  getOpenDependencyIds,
  isItemUnblocked,
  markNextUnblockedReady,
  pauseBuildListItem,
  resumeBuildListItem,
  retryBuildListItem,
  skipBuildListItem,
  validateBuildList,
  type BuildListV0
} from "../index.js";

function fixture(): BuildListV0 {
  return {
    id: "p2b",
    title: "List skeleton",
    items: [
      { id: "a", title: "First", status: "pending" },
      { id: "b", title: "Second", status: "pending", depends_on: ["a"] },
      { id: "c", title: "Third", status: "pending", depends_on: ["b"] }
    ]
  };
}

test("selects the first open item", () => {
  const list = fixture();
  assert.equal(getNextUnblockedItem(list)?.id, "a");
  assert.equal(isItemUnblocked(list, list.items[0]), true);
  assert.deepEqual(getOpenDependencyIds(list, list.items[1]), ["a"]);
});

test("marks the next item ready without changing the source", () => {
  const list = fixture();
  const updated = markNextUnblockedReady(list);
  assert.equal(list.items[0].status, "pending");
  assert.equal(updated.items[0].status, "ready");
});

test("closed items satisfy later items", () => {
  const firstDone: BuildListV0 = {
    ...fixture(),
    items: [{ id: "a", title: "First", status: "done" }, ...fixture().items.slice(1)]
  };
  assert.equal(getNextUnblockedItem(firstDone)?.id, "b");

  const firstSkipped: BuildListV0 = {
    ...fixture(),
    items: [{ id: "a", title: "First", status: "skipped" }, ...fixture().items.slice(1)]
  };
  assert.equal(getNextUnblockedItem(firstSkipped)?.id, "b");
});

test("state helpers update notes and attempts", () => {
  const paused = pauseBuildListItem(fixture(), "a", "wait");
  assert.equal(paused.items[0].status, "paused");
  assert.deepEqual(paused.items[0].notes, ["wait"]);

  const resumed = resumeBuildListItem(paused, "a");
  assert.equal(resumed.items[0].status, "pending");

  const skipped = skipBuildListItem(resumed, "a", "done another way");
  assert.equal(skipped.items[0].status, "skipped");
  assert.deepEqual(skipped.items[0].notes, ["wait", "done another way"]);

  const retried = retryBuildListItem(skipped, "a", "again");
  assert.equal(retried.items[0].status, "pending");
  assert.equal(retried.items[0].attempts, 1);
  assert.deepEqual(retried.items[0].notes, ["wait", "done another way", "again"]);
});

test("counts progress", () => {
  const list: BuildListV0 = {
    id: "progress",
    title: "Progress",
    items: [
      { id: "a", title: "A", status: "done" },
      { id: "b", title: "B", status: "skipped" },
      { id: "c", title: "C", status: "pending" },
      { id: "d", title: "D", status: "failed" }
    ]
  };
  assert.deepEqual(getBuildListProgress(list), {
    total: 4,
    pending: 1,
    ready: 0,
    active: 0,
    paused: 0,
    done: 1,
    skipped: 1,
    blocked: 0,
    failed: 1,
    complete: 2,
    remaining: 2
  });
});

test("validates ids and references", () => {
  const list: BuildListV0 = {
    id: "bad",
    title: "Bad",
    items: [
      { id: "a", title: "A", status: "pending" },
      { id: "a", title: "Duplicate", status: "pending" },
      { id: "b", title: "B", status: "pending", depends_on: ["missing"] }
    ]
  };
  assert.deepEqual(getMissingDependencyIds(list, list.items[2]), ["missing"]);
  assert.deepEqual(validateBuildList(list), ["duplicate item id: a", "item b depends on missing item missing"]);
});
