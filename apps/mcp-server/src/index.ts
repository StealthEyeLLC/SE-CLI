import { readFile } from "node:fs/promises";
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { createStateCard } from "@stealtheye/se-core";

const port = Number.parseInt(process.env.PORT || "10000", 10);
const host = "0.0.0.0";
const startedAt = new Date().toISOString();
const repoRoot = process.env.SECLI_REPO_ROOT || process.cwd();
const defaultRepository = process.env.SECLI_GITHUB_REPOSITORY || "StealthEyeLLC/SE-CLI";
const defaultBranch = process.env.SECLI_GITHUB_BRANCH || process.env.SECLI_DEFAULT_BRANCH || "main";
const runtimeMode = "real-mcp-bootstrap-batch-write";

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: unknown;
}

interface JsonRpcSuccess {
  jsonrpc: "2.0";
  id: string | number | null;
  result: unknown;
}

interface JsonRpcError {
  jsonrpc: "2.0";
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

interface ReadOnlyToolDefinition {
  name: string;
  description: string;
  filePath?: string;
}

interface BootstrapWriteArgs {
  path?: unknown;
  content?: unknown;
  message?: unknown;
  branch?: unknown;
}

interface ParsedBootstrapWriteArgs {
  path: string;
  content: string;
  message?: string;
  branch?: string;
}

interface BatchWriteFileArgs {
  path?: unknown;
  content?: unknown;
}

interface BatchWriteArgs {
  files?: unknown;
  message?: unknown;
  branch?: unknown;
}

interface ParsedBatchWriteFile {
  path: string;
  content: string;
}

interface ParsedBatchWriteArgs {
  files: ParsedBatchWriteFile[];
  message?: string;
  branch?: string;
}

interface GitHubContentResponse {
  sha?: string;
  type?: string;
}

interface GitHubUpdateResponse {
  commit?: {
    sha?: string;
    html_url?: string;
  };
  content?: {
    path?: string;
    html_url?: string;
  } | null;
}

const readOnlyTools: ReadOnlyToolDefinition[] = [
  {
    name: "se.get_state_card",
    description: "Return the current SE-CLI State Card. Read-only. Does not mutate repository, Render, GitHub, or worker state.",
  },
  {
    name: "se.read_handoff",
    description: "Read ops/HANDOFF.md. Read-only. Returns the current new-tab continuation context.",
    filePath: "ops/HANDOFF.md",
  },
  {
    name: "se.read_build_plan",
    description: "Read ops/BUILD_PLAN.md. Read-only. Returns the living implementation plan.",
    filePath: "ops/BUILD_PLAN.md",
  },
  {
    name: "se.read_upgrade_list",
    description: "Read ops/UPGRADE_LIST.md. Read-only. Returns the ranked build backlog.",
    filePath: "ops/UPGRADE_LIST.md",
  },
  {
    name: "se.read_latest_receipt",
    description: "Read ops/RECEIPT.md. Read-only. Returns the latest compact mission receipt.",
    filePath: "ops/RECEIPT.md",
  },
];

const bootstrapWriteTool = {
  name: "se.apply_single_file_update",
  description: "Routine lane: create or update one allowed UTF-8 repository file through GitHub.",
};

const batchWriteTool = {
  name: "se.apply_file_batch",
  description: "Routine lane: create or update a small set of allowed UTF-8 repository files through GitHub.",
};

function normalizePath(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }
  return pathname.replace(/\/+$/, "");
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function rpcSuccess(id: JsonRpcRequest["id"], result: unknown): JsonRpcSuccess {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string, data?: unknown): JsonRpcError {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message, ...(data === undefined ? {} : { data }) } };
}

function emptyInputSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {},
  };
}

function singleWriteInputSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["path", "content"],
    properties: {
      path: { type: "string", description: "Repository-relative path for one allowed UTF-8 file." },
      content: { type: "string", description: "Complete replacement file content." },
      message: { type: "string", description: "Optional concise commit message." },
      branch: { type: "string", description: "Optional branch. Defaults to SECLI_GITHUB_BRANCH or main." },
    },
  };
}

function batchWriteInputSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["files"],
    properties: {
      files: {
        type: "array",
        minItems: 1,
        maxItems: 50,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["path", "content"],
          properties: {
            path: { type: "string", description: "Repository-relative path for one allowed UTF-8 file." },
            content: { type: "string", description: "Complete replacement file content." },
          },
        },
      },
      message: { type: "string", description: "Optional concise commit message prefix." },
      branch: { type: "string", description: "Optional branch. Defaults to SECLI_GITHUB_BRANCH or main." },
    },
  };
}

function toolList() {
  const readTools = readOnlyTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: emptyInputSchema(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
    },
  }));

  return {
    tools: [
      ...readTools,
      {
        name: bootstrapWriteTool.name,
        description: bootstrapWriteTool.description,
        inputSchema: singleWriteInputSchema(),
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          openWorldHint: true,
        },
      },
      {
        name: batchWriteTool.name,
        description: batchWriteTool.description,
        inputSchema: batchWriteInputSchema(),
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          openWorldHint: true,
        },
      },
    ],
  };
}

function toolResultText(text: string, structuredContent?: unknown) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
    ...(structuredContent === undefined ? {} : { structuredContent }),
    isError: false,
  };
}

async function readRepoFile(relativePath: string): Promise<{ path: string; content: string }> {
  const resolvedPath = path.resolve(repoRoot, relativePath);
  const resolvedRoot = path.resolve(repoRoot);

  if (!resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Refusing to read outside repo root: ${relativePath}`);
  }

  const content = await readFile(resolvedPath, "utf8");
  return { path: relativePath, content };
}

function getGitHubToken(): string {
  const token = process.env.SECLI_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error("GitHub token is not configured. Set SECLI_GITHUB_TOKEN or GITHUB_TOKEN in Render.");
  }
  return token;
}

function normalizeRepoPath(rawPath: string): string {
  const trimmed = rawPath.trim();
  const normalized = trimmed.replace(/\\/g, "/").replace(/^\.\//, "");
  if (!normalized || normalized.startsWith("/") || normalized.includes("..") || normalized.includes("//")) {
    throw new Error(`Invalid repository path: ${rawPath}`);
  }
  return normalized;
}

function normalizeBranch(rawBranch?: string): string {
  const branch = (rawBranch?.trim() || defaultBranch).replace(/^refs\/heads\//, "");
  if (!branch || branch.includes("..") || branch.startsWith("/") || branch.endsWith("/")) {
    throw new Error(`Invalid branch: ${branch}`);
  }
  return branch;
}

function assertAllowedBootstrapWritePath(repoPath: string): void {
  const blockedPrefixes = [".git/", ".github/", "node_modules/", "dist/", "build/", "coverage/", ".pnpm-store/"];
  const blockedExact = new Set(["render.yaml", ".env", ".env.local", ".npmrc"]);
  const blockedSuffixes = [".pem", ".key", ".p12", ".pfx", ".jks", ".keystore"];
  const allowedExtensions = [
    ".md",
    ".txt",
    ".json",
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".yml",
    ".yaml",
    ".toml",
    ".html",
    ".css",
    ".dockerignore",
  ];
  const allowedExact = new Set(["readme.md", "agents.md", "dockerfile", "package.json", "pnpm-workspace.yaml", "tsconfig.base.json"]);

  const lowerPath = repoPath.toLowerCase();
  if (blockedPrefixes.some((prefix) => lowerPath.startsWith(prefix))) {
    throw new Error(`Path is outside routine update scope: ${repoPath}`);
  }
  if (blockedExact.has(lowerPath) || lowerPath.includes(".env") || lowerPath.includes("secret") || lowerPath.includes("token")) {
    throw new Error(`Path is outside routine update scope: ${repoPath}`);
  }
  if (blockedSuffixes.some((suffix) => lowerPath.endsWith(suffix))) {
    throw new Error(`Path is outside routine update scope: ${repoPath}`);
  }
  if (allowedExact.has(lowerPath)) {
    return;
  }
  if (!allowedExtensions.some((extension) => lowerPath.endsWith(extension))) {
    throw new Error(`Only common UTF-8 text files are allowed by routine update scope: ${repoPath}`);
  }
}

function parseBootstrapWriteArgs(args: unknown): ParsedBootstrapWriteArgs {
  const value = args as BootstrapWriteArgs | undefined;
  if (!value || typeof value.path !== "string" || typeof value.content !== "string") {
    throw new Error("se.apply_single_file_update requires string arguments: path and content");
  }
  if (value.message !== undefined && typeof value.message !== "string") {
    throw new Error("message must be a string when provided");
  }
  if (value.branch !== undefined && typeof value.branch !== "string") {
    throw new Error("branch must be a string when provided");
  }

  const byteLength = Buffer.byteLength(value.content, "utf8");
  if (byteLength > 500_000) {
    throw new Error("content is too large for single-file update");
  }

  const parsed: ParsedBootstrapWriteArgs = {
    path: value.path,
    content: value.content,
  };
  if (value.message !== undefined) {
    parsed.message = value.message;
  }
  if (value.branch !== undefined) {
    parsed.branch = value.branch;
  }
  return parsed;
}

function parseBatchWriteArgs(args: unknown): ParsedBatchWriteArgs {
  const value = args as BatchWriteArgs | undefined;
  if (!value || !Array.isArray(value.files)) {
    throw new Error("se.apply_file_batch requires a files array");
  }
  if (value.files.length < 1 || value.files.length > 50) {
    throw new Error("se.apply_file_batch requires 1 to 50 files");
  }
  if (value.message !== undefined && typeof value.message !== "string") {
    throw new Error("message must be a string when provided");
  }
  if (value.branch !== undefined && typeof value.branch !== "string") {
    throw new Error("branch must be a string when provided");
  }

  const seen = new Set<string>();
  let totalBytes = 0;
  const files: ParsedBatchWriteFile[] = value.files.map((entry, index) => {
    const file = entry as BatchWriteFileArgs | undefined;
    if (!file || typeof file.path !== "string" || typeof file.content !== "string") {
      throw new Error(`files[${index}] requires string path and content`);
    }
    const repoPath = normalizeRepoPath(file.path);
    assertAllowedBootstrapWritePath(repoPath);
    if (seen.has(repoPath)) {
      throw new Error(`Duplicate path in batch: ${repoPath}`);
    }
    seen.add(repoPath);
    totalBytes += Buffer.byteLength(file.content, "utf8");
    return { path: repoPath, content: file.content };
  });

  if (totalBytes > 1_000_000) {
    throw new Error("batch content is too large");
  }

  const parsed: ParsedBatchWriteArgs = { files };
  if (value.message !== undefined) {
    parsed.message = value.message;
  }
  if (value.branch !== undefined) {
    parsed.branch = value.branch;
  }
  return parsed;
}

function githubContentUrl(repository: string, repoPath: string): string {
  const encodedPath = repoPath.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repository}/contents/${encodedPath}`;
}

function githubHeaders(token: string, includeContentType: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "user-agent": "se-cli-mcp",
    "x-github-api-version": "2022-11-28",
  };
  if (includeContentType) {
    headers["content-type"] = "application/json";
  }
  return headers;
}

async function githubPut<T>(url: string, body: Record<string, unknown>, token: string): Promise<T> {
  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(token, true),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${text.slice(0, 500)}`);
  }

  return (await response.json()) as T;
}

async function fetchExistingGitHubFile(repository: string, repoPath: string, branch: string, token: string): Promise<GitHubContentResponse | null> {
  const url = `${githubContentUrl(repository, repoPath)}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: githubHeaders(token, false),
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API read failed (${response.status}): ${text.slice(0, 500)}`);
  }

  const body = (await response.json()) as GitHubContentResponse;
  if (body.type && body.type !== "file") {
    throw new Error(`GitHub path is not a file: ${repoPath}`);
  }
  return body;
}

function assertBootstrapWriteEnabled(): void {
  if (process.env.SECLI_BOOTSTRAP_WRITE_ENABLED === "0" || process.env.SECLI_BOOTSTRAP_WRITE_ENABLED === "false") {
    throw new Error("Routine update lane is disabled by SECLI_BOOTSTRAP_WRITE_ENABLED");
  }
}

async function applySingleFileUpdate(args: unknown) {
  assertBootstrapWriteEnabled();
  const parsed = parseBootstrapWriteArgs(args);
  const repoPath = normalizeRepoPath(parsed.path);
  assertAllowedBootstrapWritePath(repoPath);
  const branch = normalizeBranch(parsed.branch);

  const token = getGitHubToken();
  const existing = await fetchExistingGitHubFile(defaultRepository, repoPath, branch, token);
  const message = parsed.message?.trim() || `se-cli: update ${repoPath}`;
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(parsed.content, "utf8").toString("base64"),
    branch,
  };
  if (existing?.sha) {
    body.sha = existing.sha;
  }

  const result = await githubPut<GitHubUpdateResponse>(githubContentUrl(defaultRepository, repoPath), body, token);

  const structured = {
    ok: true,
    tool: bootstrapWriteTool.name,
    repository: defaultRepository,
    branch,
    path: repoPath,
    action: existing?.sha ? "updated" : "created",
    commit_sha: result.commit?.sha ?? null,
    commit_url: result.commit?.html_url ?? null,
    content_url: result.content?.html_url ?? null,
  };

  return toolResultText(JSON.stringify(structured, null, 2), structured);
}

async function applyFileBatch(args: unknown) {
  assertBootstrapWriteEnabled();
  const parsed = parseBatchWriteArgs(args);
  const branch = normalizeBranch(parsed.branch);
  const token = getGitHubToken();
  const messagePrefix = parsed.message?.trim() || `se-cli: batch update ${parsed.files.length} files`;
  const results = [];

  for (const file of parsed.files) {
    const existing = await fetchExistingGitHubFile(defaultRepository, file.path, branch, token);
    const body: Record<string, unknown> = {
      message: `${messagePrefix}: ${file.path}`,
      content: Buffer.from(file.content, "utf8").toString("base64"),
      branch,
    };
    if (existing?.sha) {
      body.sha = existing.sha;
    }
    const result = await githubPut<GitHubUpdateResponse>(githubContentUrl(defaultRepository, file.path), body, token);
    results.push({
      path: file.path,
      action: existing?.sha ? "updated" : "created",
      commit_sha: result.commit?.sha ?? null,
      content_url: result.content?.html_url ?? null,
    });
  }

  const structured = {
    ok: true,
    tool: batchWriteTool.name,
    repository: defaultRepository,
    branch,
    file_count: parsed.files.length,
    files: parsed.files.map((file) => file.path),
    results,
    note: "Batch completed as routine GitHub file updates.",
  };

  return toolResultText(JSON.stringify(structured, null, 2), structured);
}

async function callTool(name: string, args?: unknown) {
  if (name === "se.get_state_card") {
    const stateCard = createStateCard();
    return toolResultText(JSON.stringify(stateCard, null, 2), stateCard);
  }

  if (name === bootstrapWriteTool.name) {
    return applySingleFileUpdate(args);
  }

  if (name === batchWriteTool.name) {
    return applyFileBatch(args);
  }

  const tool = readOnlyTools.find((candidate) => candidate.name === name);
  if (!tool?.filePath) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const document = await readRepoFile(tool.filePath);
  return toolResultText(document.content, {
    path: document.path,
    content: document.content,
  });
}

async function handleRpc(request: JsonRpcRequest): Promise<JsonRpcResponse | null> {
  const id = request.id ?? null;

  switch (request.method) {
    case "initialize":
      return rpcSuccess(id, {
        protocolVersion: "2025-06-18",
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: "se-cli-mcp",
          version: "0.1.0",
        },
      });

    case "notifications/initialized":
      return null;

    case "ping":
      return rpcSuccess(id, {});

    case "tools/list":
      return rpcSuccess(id, toolList());

    case "tools/call": {
      const params = request.params as { name?: string; arguments?: unknown } | undefined;
      if (!params?.name) {
        return rpcError(id, -32602, "tools/call requires params.name");
      }

      try {
        return rpcSuccess(id, await callTool(params.name, params.arguments));
      } catch (error) {
        return rpcError(id, -32601, error instanceof Error ? error.message : `Unknown tool: ${params.name}`);
      }
    }

    default:
      return rpcError(id, -32601, `Method not found: ${request.method ?? "<missing>"}`);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const routePath = normalizePath(url.pathname);

  if (req.method === "GET" && routePath === "/healthz") {
    sendJson(res, 200, { ok: true, service: "se-cli-mcp", runtime: runtimeMode, started_at: startedAt });
    return;
  }

  if (req.method === "GET" && routePath === "/readyz") {
    sendJson(res, 200, {
      ok: true,
      service: "se-cli-mcp",
      runtime: runtimeMode,
      github_write: process.env.SECLI_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN ? "configured" : "not configured",
      database: process.env.DATABASE_URL ? "configured" : "not configured",
      queue: process.env.QUEUE_URL || process.env.REDIS_URL ? "configured" : "not configured",
    });
    return;
  }

  if (req.method === "GET" && routePath === "/status") {
    sendJson(res, 200, createStateCard());
    return;
  }

  if (routePath === normalizePath(process.env.SECLI_MCP_PATH || "/mcp")) {
    if (req.method !== "POST") {
      sendJson(res, 405, {
        ok: false,
        error: "MCP endpoint expects JSON-RPC POST requests.",
      });
      return;
    }

    try {
      const body = await readBody(req);
      const request = JSON.parse(body || "{}") as JsonRpcRequest;
      if (request.jsonrpc !== "2.0" || !request.method) {
        sendJson(res, 400, rpcError(request.id, -32600, "Invalid JSON-RPC request"));
        return;
      }

      const response = await handleRpc(request);
      if (response === null) {
        res.writeHead(204);
        res.end();
        return;
      }
      sendJson(res, 200, response);
    } catch (error) {
      sendJson(res, 400, rpcError(null, -32700, error instanceof Error ? error.message : "Parse error"));
    }
    return;
  }

  if (req.method === "GET" && routePath === "/") {
    sendJson(res, 200, {
      ok: true,
      service: "se-cli-mcp",
      runtime: runtimeMode,
      message: "SE-CLI MCP runtime. Available endpoints: /healthz, /readyz, /status, /mcp",
    });
    return;
  }

  sendJson(res, 404, {
    ok: false,
    service: "se-cli-mcp",
    runtime: runtimeMode,
    message: "Route not found. Available endpoints: /healthz, /readyz, /status, /mcp",
    path: routePath,
  });
});

server.listen(port, host, () => {
  console.log(`SE-CLI MCP server listening on ${host}:${port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received; shutting down SE-CLI MCP server");
  server.close(() => process.exit(0));
});
