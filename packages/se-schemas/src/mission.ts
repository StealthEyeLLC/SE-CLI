import type { AuthorityClassV0, FailureClassV0 } from "./primitives.js";

export interface BuildListV0 {
  id: string;
  title: string;
  status: "draft" | "approved" | "running" | "paused" | "blocked" | "completed" | "cancelled" | "failed";
  progress_completed: number;
  progress_total: number;
  current_item_id?: string;
  default_authority_class: AuthorityClassV0;
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
  proof_requirements: string[];
}

export interface MissionV0 {
  id: string;
  title: string;
  goal: string;
  status: "planned" | "queued" | "running" | "passed" | "failed" | "blocked" | "cancelled";
  authority_class: AuthorityClassV0;
  scope: string;
  allowed_paths: string[];
  allowed_commands: string[];
  validation_commands: string[];
  base_ref: string;
  branch_name: string;
  build_list_id?: string;
  item_id?: string;
  packet_id?: string;
  job_id?: string;
  failure_class?: FailureClassV0;
  created_at: string;
  updated_at: string;
}
