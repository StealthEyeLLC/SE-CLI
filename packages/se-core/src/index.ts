export type SeMode =
  | "bootstrap"
  | "render-bootstrap-verified"
  | "real-mcp-read-only"
  | "planned"
  | "running"
  | "blocked"
  | "completed";

export interface StateCard {
  service: string;
  mode: SeMode;
  mission: string;
  branch: string;
  pr: string | null;
  ci: string;
  worker: string;
  render: string;
  last_action: string;
  next_action: string;
  blocked: boolean;
  needs_approval: string;
  risk: "low" | "normal" | "elevated" | "hard-stop";
  updated_at: string;
}

export function createStateCard(now = new Date()): StateCard {
  return {
    service: "se-cli-mcp",
    mode: "real-mcp-read-only",
    mission: "P1A/U001 Render-first real MCP vertical slice",
    branch: process.env.SECLI_DEFAULT_BRANCH || "main",
    pr: null,
    ci: "not configured yet",
    worker: "not implemented yet",
    render: "real MCP read-only runtime active",
    last_action: "real TypeScript MCP runtime deployed",
    next_action: "connect ChatGPT custom app to /mcp and test se.get_state_card",
    blocked: false,
    needs_approval: "none for read-only status checks; normal mission approval for future implementation work",
    risk: "low",
    updated_at: now.toISOString(),
  };
}
