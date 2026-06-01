import type { MissionV0, PolicyDecisionV0, ResultPacketV0, ContinueActionV0, ReviewNeedV0 } from "@stealtheye/se-schemas";

export interface PolicyVerdictV0 {
  ok: boolean;
  decision: PolicyDecisionV0;
  reasons: string[];
  limited_paths: string[];
  limited_commands: string[];
}

export interface ContinueDecisionV0 {
  action: ContinueActionV0;
  review: ReviewNeedV0;
  reason: string;
  retry_allowed: boolean;
  next_item_id?: string;
}

export function pathAllowed(value: string): boolean {
  const item = value.trim().replace(/\\/g, "/");
  return Boolean(item) && !item.startsWith("/") && !item.includes("..") && !item.startsWith("node_modules/");
}

export function commandAllowed(value: string): boolean {
  const item = value.trim().replace(/\s+/g, " ");
  return ["pnpm install", "pnpm build", "pnpm typecheck", "pnpm test", "node --test"].some((prefix) => item === prefix || item.startsWith(`${prefix} `));
}

export function evaluateMissionPolicy(mission: MissionV0): PolicyVerdictV0 {
  const limited_paths = mission.allowed_paths.filter((item) => !pathAllowed(item));
  const limited_commands = [...mission.allowed_commands, ...mission.validation_commands].filter((item) => !commandAllowed(item));
  if (limited_paths.length > 0 || limited_commands.length > 0) return { ok: false, decision: "reject", reasons: ["outside routine shape"], limited_paths, limited_commands };
  if (mission.authority_class === "elevated") return { ok: false, decision: "needs_boundary", reasons: ["elevated review"], limited_paths: [], limited_commands: [] };
  if (mission.authority_class === "stop") return { ok: false, decision: "reject", reasons: ["stop class"], limited_paths: [], limited_commands: [] };
  return { ok: true, decision: "allow", reasons: ["routine shape"], limited_paths: [], limited_commands: [] };
}

export function decideContinuation(input: { result?: ResultPacketV0; next_item_id?: string; proof_pending?: boolean; needs_user?: boolean }): ContinueDecisionV0 {
  if (input.needs_user) return { action: "request_user", review: "user", reason: "user choice needed", retry_allowed: false };
  if (input.proof_pending) return { action: "wait_for_proof", review: "none", reason: "proof pending", retry_allowed: false };
  if (input.result?.status === "passed" && input.next_item_id) return { action: "advance_next_item", review: "none", reason: "previous item passed", retry_allowed: false, next_item_id: input.next_item_id };
  if (input.result?.status === "passed") return { action: "complete", review: "none", reason: "no next item", retry_allowed: false };
  if (input.result?.status === "failed") return { action: "request_review", review: "review", reason: "repair review needed", retry_allowed: false };
  return { action: "pause", review: "review", reason: "state unclear", retry_allowed: false };
}
