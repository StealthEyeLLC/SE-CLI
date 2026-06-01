import assert from "node:assert/strict";
import test from "node:test";
import {
  getBuildListProgress,
  getNextUnblockedItem,
  markNextUnblockedReady,
  pauseBuildListItem,
  retryBuildListItem,
  validateBuildList,
  type BuildListV0
} from "../index.js";

function list(): BuildListV0 {
  return {
    id: "p2b",
    title: "List",
    items: [
      { id: "a", title: "A", status: "pending" },
      { id: "b", title: "B", status: "pending", depends_on: ["a"] }
    ]
  };
}

test("selects next item", () => {
  assert.equal(getNextUnblockedItem(list())?.id, "a");
});

test("marks next item", () => {
  const updated = markNextUnblockedReady(list());
  assert.equal(updated.items.find((item) => item.id === "a")?.status, "ready");
});

test("updates item state", () => {
  const paused = pauseBuildListItem(list(), "a", "wait");
  assert.equal(paused.items.find((item) => item.id === "a")?.status, "paused");
  const retried = retryBuildListItem(paused, "a", "again");
  const item = retried.items.find((entry) => entry.id === "a");
  assert.equal(item?.status, "pending");
  assert.equal(item?.attempts, 1);
});

test("counts progress", () => {
  const progress = getBuildListProgress({
    id: "p",
    title: "P",
    items: [
      { id: "a", title: "A", status: "done" },
      { id: "b", title: "B", status: "skipped" },
      { id: "c", title: "C", status: "failed" }
    ]
  });
  assert.equal(progress.total, 3);
  assert.equal(progress.complete, 2);
  assert.equal(progress.remaining, 1);
});

test("validates references", () => {
  assert.deepEqual(validateBuildList({
    id: "bad",
    title: "Bad",
    items: [
      { id: "a", title: "A", status: "pending" },
      { id: "a", title: "Again", status: "pending" },
      { id: "b", title: "B", status: "pending", depends_on: ["missing"] }
    ]
  }), ["duplicate item id: a", "item b depends on missing item missing"]);
});
