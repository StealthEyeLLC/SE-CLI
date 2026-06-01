import type { FailureClassV0 } from "./primitives.js";

export interface ResultPacketV0 {
  id: string;
  mission_id: string;
  job_id: string;
  status: "passed" | "failed" | "blocked" | "cancelled" | "needs_boundary" | "needs_decision";
  tiny_summary: string;
  standard_summary: string;
  detail_ref?: string;
  files_changed: string[];
  commands_run: string[];
  checks_run: string[];
  artifacts: string[];
  failure_class: FailureClassV0;
  recommended_next_action: string;
  needs_user: boolean;
  needs_review: boolean;
  confidence: "low" | "medium" | "high";
  created_at: string;
}
