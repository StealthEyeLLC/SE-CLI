export type AuthorityClassV0 = "read" | "normal" | "elevated" | "hard_stop";

export type MissionStatusV0 =
  | "planned"
  | "packet_created"
  | "queued"
  | "leased"
  | "running"
  | "validating"
  | "branching"
  | "pr_opened"
  | "ci_pending"
  | "ci_running"
  | "passed"
  | "failed"
  | "repairing"
  | "blocked"
  | "cancelled";

export type ResultStatusV0 = "passed" | "failed" | "blocked" | "cancelled" | "needs_boundary" | "needs_decision";
export type FailureClassV0 = "none" | "test_failure" | "typecheck_failure" | "build_failure" | "install_failure" | "git_conflict" | "ci_environment_failure" | "worker_crash" | "runtime_failure" | "missing_config" | "permission_issue" | "scope_issue" | "product_decision" | "rate_limit" | "flaky_failure" | "unknown_failure";
export type PolicyDecisionV0 = "allow" | "boundary_required" | "reject";
export type ReasoningRequirementV0 = "none" | "review_required" | "user_required";
export type ContinuationActionV0 = "advance_next_item" | "wait_for_proof" | "retry_by_rule" | "requeue_or_quarantine" | "request_review" | "request_user" | "pause" | "complete";

export interface AppRequestEnvelopeV0 {
  request_id: string;
  user_intent: string;
  operation: string;
  target?: string;
  approval_context?: string;
  idempotency_key: string;
  chat_summary?: string;
  expected_response_mode?: "tiny" | "standard" | "full";
  max_summary_tokens?: number;
  client_capabilities?: string[];
}

export interface ServerResponseEnvelopeV0 {
  ok: boolean;
  status: "accepted" | "running" | "passed" | "failed" | "blocked" | "cancelled";
  message: string;
  state?: unknown;
  next_action?: string;
  needs_user: boolean;
  needs_review: boolean;
  tool_suggestion?: string;
  result_packet?: ResultPacketV0;
  artifact_links?: string[];
  display_summary: string;
}

export interface BuildListV0 {
  id: string;
  title: string;
  status: "draft" | "approved" | "running" | "paused" | "blocked" | "completed" | "cancelled" | "failed";
  approval_mode: "single_mission" | "build_list" | "normal_until_boundary";
  created_at: string;
  updated_at: string;
  current_item_id?: string;
  progress_completed: number;
  progress_total: number;
  stop_policy: "stop_on_blocker" | "continue_unrelated" | "stop_after_current_pr";
  default_authority_class: AuthorityClassV0;
  continuation_mode: "manual" | "heartbeat" | "server_mechanical";
}

export interface BuildListItemV0 {
  id: string;
  build_list_id: string;
  title: string;
  description: string;
  priority: number;
  dependencies: string[];
  status: "queued" | "running" | "passed" | "failed" | "blocked" | "skipped" | "cancelled";
  scope: string;
  allowed_paths: string[];
  allowed_commands: string[];
  expected_outputs: string[];
  proof_requirements: string[];
  stop_conditions: string[];
  mission_template: string;
  last_mission_id?: string;
}

export interface MissionV0 {
  id: string;
  build_list_id?: string;
  item_id?: string;
  title: string;
  goal: string;
  status: MissionStatusV0;
  authority_class: AuthorityClassV0;
  scope: string;
  allowed_paths: string[];
  allowed_commands: string[];
  forbidden_paths: string[];
  expected_outputs: string[];
  validation_commands: string[];
  stop_conditions: string[];
  base_ref: string;
  branch_name: string;
  packet_id?: string;
  job_id?: string;
  pr_number?: number;
  ci_status?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  failure_class?: FailureClassV0;
  next_action?: string;
}
