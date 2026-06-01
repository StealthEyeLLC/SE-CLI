interface ToolDefinition {
  name: string;
  description: string;
}

interface ToolTextResult {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: unknown;
  isError: boolean;
}

interface CheckArgs {
  branch?: unknown;
  service_url?: unknown;
}

interface RunSummary {
  id: number;
  name: string;
  event: string;
  status: string;
  conclusion: string | null;
  head_sha: string;
  branch: string;
  html_url: string;
  created_at: string;
  updated_at: string;
}

const defaultRepository = process.env.SECLI_GITHUB_REPOSITORY || "StealthEyeLLC/SE-CLI";
const defaultBranch = process.env.SECLI_GITHUB_BRANCH || process.env.SECLI_DEFAULT_BRANCH || "main";
const defaultServiceUrl = (process.env.SECLI_PUBLIC_SERVICE_URL || process.env.RENDER_EXTERNAL_URL || "https://se-cli-mcp.onrender.com").replace(/\/+$/, "");
const defaultRenderServiceId = process.env.SECLI_RENDER_SERVICE_ID || process.env.RENDER_SERVICE_ID || "srv-d8ehlvvavr4c738olbm0";

export const controlTools: ToolDefinition[] = [
  {
    name: "se.get_ic_status",
    description: "Return the latest integrated-check status from GitHub using SE-CLI's own token and compact proof summary."
  },
  {
    name: "se.get_service_status",
    description: "Return live service health, readiness, state card, and Render metadata when configured."
  },
  {
    name: "se.get_proof_packet",
    description: "Return one compact proof packet combining repository, integrated-check, and service status."
  }
];

export function controlInputSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      branch: { type: "string", description: "Optional branch name. Defaults to main." },
      service_url: { type: "string", description: "Optional public service URL." }
    }
  };
}

function toolResultText(text: string, structuredContent?: unknown): ToolTextResult {
  return {
    content: [{ type: "text", text }],
    ...(structuredContent === undefined ? {} : { structuredContent }),
    isError: false
  };
}

function getGitHubToken(optional = false): string {
  const token = process.env.SECLI_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token && !optional) {
    throw new Error("GitHub token is not configured. Set SECLI_GITHUB_TOKEN or GITHUB_TOKEN in Render.");
  }
  return token || "";
}

function getRenderToken(): string {
  return process.env.SECLI_RENDER_API_KEY || process.env.RENDER_API_KEY || "";
}

function githubHeaders(token: string): Record<string, string> {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "user-agent": "se-cli-mcp",
    "x-github-api-version": "2022-11-28"
  };
}

function renderHeaders(token: string): Record<string, string> {
  return {
    accept: "application/json",
    authorization: `Bearer ${token}`,
    "user-agent": "se-cli-mcp"
  };
}

async function getJson<T>(url: string, headers: Record<string, string>, timeoutMs = 10000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GET failed ${response.status}: ${text.slice(0, 400)}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function getPublicJson(url: string): Promise<{ ok: boolean; status: number; body: unknown; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    return { ok: false, status: 0, body: null, error: error instanceof Error ? error.message : "request failed" };
  } finally {
    clearTimeout(timer);
  }
}

function parseArgs(args: unknown): { branch: string; serviceUrl: string } {
  const value = args as CheckArgs | undefined;
  const branch = typeof value?.branch === "string" && value.branch.trim() ? value.branch.trim().replace(/^refs\/heads\//, "") : defaultBranch;
  const serviceUrl = typeof value?.service_url === "string" && value.service_url.trim() ? value.service_url.trim().replace(/\/+$/, "") : defaultServiceUrl;
  return { branch, serviceUrl };
}

async function getLatestCommit(repository: string, branch: string, token: string): Promise<{ sha: string; html_url: string; message: string }> {
  const encodedBranch = encodeURIComponent(branch);
  const body = await getJson<{ sha: string; html_url: string; commit?: { message?: string } }>(`https://api.github.com/repos/${repository}/commits/${encodedBranch}`, githubHeaders(token));
  return { sha: body.sha, html_url: body.html_url, message: body.commit?.message || "" };
}

async function getLatestRun(repository: string, branch: string, token: string): Promise<RunSummary | null> {
  const url = `https://api.github.com/repos/${repository}/actions/runs?branch=${encodeURIComponent(branch)}&per_page=20`;
  const body = await getJson<{ workflow_runs?: Array<Record<string, unknown>> }>(url, githubHeaders(token));
  const runs = body.workflow_runs || [];
  const selected = runs.find((run) => String(run.name || "").toLowerCase() === "ci") || runs[0];
  if (!selected) return null;
  return {
    id: Number(selected.id),
    name: String(selected.name || ""),
    event: String(selected.event || ""),
    status: String(selected.status || "unknown"),
    conclusion: selected.conclusion === null || selected.conclusion === undefined ? null : String(selected.conclusion),
    head_sha: String(selected.head_sha || ""),
    branch: String(selected.head_branch || branch),
    html_url: String(selected.html_url || ""),
    created_at: String(selected.created_at || ""),
    updated_at: String(selected.updated_at || "")
  };
}

async function getRunJobs(repository: string, runId: number, token: string) {
  const body = await getJson<{ jobs?: Array<Record<string, unknown>> }>(`https://api.github.com/repos/${repository}/actions/runs/${runId}/jobs?per_page=20`, githubHeaders(token));
  return (body.jobs || []).map((job) => ({
    id: Number(job.id),
    name: String(job.name || ""),
    status: String(job.status || "unknown"),
    conclusion: job.conclusion === null || job.conclusion === undefined ? null : String(job.conclusion),
    started_at: String(job.started_at || ""),
    completed_at: String(job.completed_at || ""),
    html_url: String(job.html_url || "")
  }));
}

async function getIntegratedCheckStatus(args?: unknown) {
  const { branch } = parseArgs(args);
  const token = getGitHubToken();
  const latestCommit = await getLatestCommit(defaultRepository, branch, token);
  const latestRun = await getLatestRun(defaultRepository, branch, token);
  const jobs = latestRun ? await getRunJobs(defaultRepository, latestRun.id, token) : [];
  const passed = latestRun?.status === "completed" && latestRun.conclusion === "success";
  const failed = latestRun?.status === "completed" && latestRun.conclusion !== "success";
  const structured = {
    ok: true,
    service: "se-cli-mcp",
    tool: "se.get_ic_status",
    repository: defaultRepository,
    branch,
    latest_commit: latestCommit,
    latest_run: latestRun,
    jobs,
    verdict: passed ? "green" : failed ? "red" : latestRun ? "running_or_pending" : "missing",
    needs_user: false,
    needs_review: failed,
    summary: passed ? "Integrated check is green." : failed ? "Integrated check failed; review job details." : latestRun ? "Integrated check is not complete yet." : "No integrated check run was found."
  };
  return toolResultText(JSON.stringify(structured, null, 2), structured);
}

async function getRenderApiStatus() {
  const token = getRenderToken();
  if (!token || !defaultRenderServiceId) {
    return { configured: false, service_id: defaultRenderServiceId || null };
  }
  try {
    const service = await getJson<unknown>(`https://api.render.com/v1/services/${defaultRenderServiceId}`, renderHeaders(token));
    const deploys = await getJson<unknown>(`https://api.render.com/v1/services/${defaultRenderServiceId}/deploys?limit=1`, renderHeaders(token));
    return { configured: true, service_id: defaultRenderServiceId, service, deploys };
  } catch (error) {
    return { configured: true, service_id: defaultRenderServiceId, error: error instanceof Error ? error.message : "render api request failed" };
  }
}

async function getServiceStatus(args?: unknown) {
  const { serviceUrl } = parseArgs(args);
  const [healthz, readyz, status, render_api] = await Promise.all([
    getPublicJson(`${serviceUrl}/healthz`),
    getPublicJson(`${serviceUrl}/readyz`),
    getPublicJson(`${serviceUrl}/status`),
    getRenderApiStatus()
  ]);
  const publicGreen = healthz.ok && readyz.ok && status.ok;
  const structured = {
    ok: publicGreen,
    service: "se-cli-mcp",
    tool: "se.get_service_status",
    service_url: serviceUrl,
    healthz,
    readyz,
    status,
    render_api,
    verdict: publicGreen ? "green" : "attention",
    needs_user: false,
    needs_review: !publicGreen,
    summary: publicGreen ? "Service public checks are green." : "One or more service public checks need review."
  };
  return toolResultText(JSON.stringify(structured, null, 2), structured);
}

export async function callControlTool(name: string, args?: unknown): Promise<ToolTextResult | null> {
  if (name === "se.get_ic_status") return getIntegratedCheckStatus(args);
  if (name === "se.get_service_status") return getServiceStatus(args);
  if (name === "se.get_proof_packet") {
    const [ic, service] = await Promise.all([getIntegratedCheckStatus(args), getServiceStatus(args)]);
    const structured = {
      ok: true,
      service: "se-cli-mcp",
      tool: "se.get_proof_packet",
      generated_at: new Date().toISOString(),
      ic: ic.structuredContent,
      runtime: service.structuredContent,
      summary: "Proof packet assembled from SE-CLI-owned repository and service checks."
    };
    return toolResultText(JSON.stringify(structured, null, 2), structured);
  }
  return null;
}
