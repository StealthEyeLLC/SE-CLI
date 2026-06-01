import type { AuthorityClassV0, ContinueActionV0, PolicyDecisionV0, ReviewNeedV0 } from "./primitives.js";

export interface BoundaryRequestV0 {
  id: string;
  mission_id: string;
  type: "authority" | "configuration" | "product_decision" | "scope" | "external";
  summary: string;
  reason: string;
  options: string[];
  recommended_option: string;
  required_user_response: string;
  can_continue_other_items: boolean;
  created_at: string;
}

export interface PolicyVerdictV0 {
  ok: boolean;
  decision: PolicyDecisionV0;
  authority_class: AuthorityClassV0;
  reasons: string[];
  limited_paths: string[];
  limited_commands: string[];
  boundary_request?: BoundaryRequestV0;
}

export interface ContinuationDecisionV0 {
  action: ContinueActionV0;
  reasoning_requirement: ReviewNeedV0;
  reason: string;
  next_item_id?: string;
  retry_allowed: boolean;
  user_message: string;
}
