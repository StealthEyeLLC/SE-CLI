export type BuildListItemStatusV0 =
  | "pending"
  | "ready"
  | "active"
  | "paused"
  | "done"
  | "skipped"
  | "blocked"
  | "failed";

export interface BuildListItemV0 {
  id: string;
  title: string;
  status: BuildListItemStatusV0;
  depends_on?: string[];
  attempts?: number;
  notes?: string[];
}

export interface BuildListV0 {
  id: string;
  title: string;
  items: BuildListItemV0[];
}

export interface BuildListProgressV0 {
  total: number;
  pending: number;
  ready: number;
  active: number;
  paused: number;
  done: number;
  skipped: number;
  blocked: number;
  failed: number;
  complete: number;
  remaining: number;
}

const terminalStatuses = new Set<BuildListItemStatusV0>(["done", "skipped"]);

function cloneItem(item: BuildListItemV0): BuildListItemV0 {
  return {
    ...item,
    depends_on: item.depends_on ? [...item.depends_on] : undefined,
    notes: item.notes ? [...item.notes] : undefined
  };
}

function cloneList(list: BuildListV0): BuildListV0 {
  return {
    ...list,
    items: list.items.map(cloneItem)
  };
}

export function getBuildListItem(list: BuildListV0, id: string): BuildListItemV0 | undefined {
  return list.items.find((item) => item.id === id);
}

export function getRequiredItemIds(item: BuildListItemV0): string[] {
  return item.depends_on ? [...item.depends_on] : [];
}

export function getMissingDependencyIds(list: BuildListV0, item: BuildListItemV0): string[] {
  return getRequiredItemIds(item).filter((id) => !getBuildListItem(list, id));
}

export function getOpenDependencyIds(list: BuildListV0, item: BuildListItemV0): string[] {
  return getRequiredItemIds(item).filter((id) => {
    const dependency = getBuildListItem(list, id);
    return !dependency || !terminalStatuses.has(dependency.status);
  });
}

export function isItemUnblocked(list: BuildListV0, item: BuildListItemV0): boolean {
  return getOpenDependencyIds(list, item).length === 0;
}

export function getReadyItems(list: BuildListV0): BuildListItemV0[] {
  return list.items.filter((item) => item.status === "pending" && isItemUnblocked(list, item));
}

export function getNextUnblockedItem(list: BuildListV0): BuildListItemV0 | null {
  return getReadyItems(list)[0] ?? null;
}

export function updateBuildListItemStatus(list: BuildListV0, id: string, status: BuildListItemStatusV0): BuildListV0 {
  return {
    ...list,
    items: list.items.map((item) => (item.id === id ? { ...cloneItem(item), status } : cloneItem(item)))
  };
}

export function markNextUnblockedReady(list: BuildListV0): BuildListV0 {
  const next = getNextUnblockedItem(list);
  if (!next) return cloneList(list);
  return updateBuildListItemStatus(list, next.id, "ready");
}

function updateBuildListItemWithNote(
  list: BuildListV0,
  id: string,
  status: BuildListItemStatusV0,
  note?: string
): BuildListV0 {
  return {
    ...list,
    items: list.items.map((item) => {
      if (item.id !== id) return cloneItem(item);
      const notes = note ? [...(item.notes ?? []), note] : item.notes ? [...item.notes] : undefined;
      return { ...cloneItem(item), status, notes };
    })
  };
}

export function pauseBuildListItem(list: BuildListV0, id: string, note?: string): BuildListV0 {
  return updateBuildListItemWithNote(list, id, "paused", note);
}

export function resumeBuildListItem(list: BuildListV0, id: string, note?: string): BuildListV0 {
  return updateBuildListItemWithNote(list, id, "pending", note);
}

export function skipBuildListItem(list: BuildListV0, id: string, note?: string): BuildListV0 {
  return updateBuildListItemWithNote(list, id, "skipped", note);
}

export function retryBuildListItem(list: BuildListV0, id: string, note?: string): BuildListV0 {
  return {
    ...list,
    items: list.items.map((item) => {
      if (item.id !== id) return cloneItem(item);
      const notes = note ? [...(item.notes ?? []), note] : item.notes ? [...item.notes] : undefined;
      return {
        ...cloneItem(item),
        status: "pending",
        attempts: (item.attempts ?? 0) + 1,
        notes
      };
    })
  };
}

export function getBuildListProgress(list: BuildListV0): BuildListProgressV0 {
  const progress: BuildListProgressV0 = {
    total: list.items.length,
    pending: 0,
    ready: 0,
    active: 0,
    paused: 0,
    done: 0,
    skipped: 0,
    blocked: 0,
    failed: 0,
    complete: 0,
    remaining: 0
  };

  for (const item of list.items) {
    progress[item.status] += 1;
  }

  progress.complete = progress.done + progress.skipped;
  progress.remaining = progress.total - progress.complete;
  return progress;
}

export function validateBuildList(list: BuildListV0): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  if (!list.id.trim()) errors.push("list id is required");
  if (!list.title.trim()) errors.push("list title is required");

  for (const item of list.items) {
    if (!item.id.trim()) errors.push("item id is required");
    if (!item.title.trim()) errors.push(`item ${item.id || "<missing>"} title is required`);
    if (seen.has(item.id)) errors.push(`duplicate item id: ${item.id}`);
    seen.add(item.id);
  }

  for (const item of list.items) {
    for (const missing of getMissingDependencyIds(list, item)) {
      errors.push(`item ${item.id} depends on missing item ${missing}`);
    }
  }

  return errors;
}
