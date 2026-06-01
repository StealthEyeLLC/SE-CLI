export interface WorkPacketV0 {
  id: string;
  mission_id: string;
  packet_hash: string;
  base_ref: string;
  allowed_paths: string[];
  allowed_commands: string[];
  files: Array<{ path: string; content: string }>;
  validation_plan: string[];
  artifact_refs: string[];
  created_at: string;
}

export interface JobV0 {
  id: string;
  mission_id: string;
  packet_id: string;
  status: "queued" | "leased" | "running" | "passed" | "failed" | "blocked" | "cancelled" | "quarantined";
  phase: "lease" | "verify" | "prepare_workspace" | "apply" | "validate" | "commit" | "push" | "open_pr" | "watch_ci" | "report" | "complete";
  retry_count: number;
  worker_id?: string;
  lease_id?: string;
  result_packet_id?: string;
  updated_at: string;
}

export interface WorkerLeaseV0 {
  job_id: string;
  worker_id: string;
  lease_id: string;
  lease_acquired_at: string;
  lease_expires_at: string;
  heartbeat_at: string;
  current_phase: JobV0["phase"];
  retry_count: number;
  worker_fingerprint: string;
}

export interface WorkerCapabilityV0 {
  worker_id: string;
  os: string;
  runtimes: Record<string, string>;
  tools: string[];
  has_git: boolean;
  has_node: boolean;
  has_pnpm: boolean;
  has_python: boolean;
  max_job_minutes: number;
  workspace_root: string;
  network_allowed: boolean;
  access_class: "none" | "explicit";
}
