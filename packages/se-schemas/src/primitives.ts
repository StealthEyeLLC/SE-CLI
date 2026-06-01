export type AuthorityClassV0 = "read" | "normal" | "elevated" | "stop";

export type ReviewNeedV0 = "none" | "review" | "user";

export type PolicyDecisionV0 = "allow" | "needs_boundary" | "reject";

export type FailureClassV0 =
  | "none"
  | "test"
  | "typecheck"
  | "build"
  | "install"
  | "git"
  | "ci"
  | "worker"
  | "runtime"
  | "config"
  | "permission"
  | "scope"
  | "decision"
  | "rate_limit"
  | "flaky"
  | "unknown";

export type ContinueActionV0 =
  | "advance_next_item"
  | "wait_for_proof"
  | "retry_by_rule"
  | "requeue_or_hold"
  | "request_review"
  | "request_user"
  | "pause"
  | "complete";
