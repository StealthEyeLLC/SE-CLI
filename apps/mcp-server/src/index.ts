import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { createStateCard } from "@stealtheye/se-core";

const port = Number.parseInt(process.env.PORT || "10000", 10);
const host = "0.0.0.0";
const startedAt = new Date().toISOString();

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

function sendText(res: ServerResponse, status: number, body: string): void {
  res.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
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

function toolList() {
  return {
    tools: [
      {
        name: "se.get_state_card",
        description: "Return the current SE-CLI State Card. Read-only. Does not mutate repository, Render, GitHub, or worker state.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          openWorldHint: false,
        },
      },
    ],
  };
}

function handleRpc(request: JsonRpcRequest): JsonRpcResponse | null {
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
      if (params.name !== "se.get_state_card") {
        return rpcError(id, -32601, `Unknown tool: ${params.name}`);
      }

      const stateCard = createStateCard();
      return rpcSuccess(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(stateCard, null, 2),
          },
        ],
        structuredContent: stateCard,
        isError: false,
      });
    }

    default:
      return rpcError(id, -32601, `Method not found: ${request.method ?? "<missing>"}`);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = normalizePath(url.pathname);

  if (req.method === "GET" && path === "/healthz") {
    sendJson(res, 200, { ok: true, service: "se-cli-mcp", runtime: "real-mcp-read-only", started_at: startedAt });
    return;
  }

  if (req.method === "GET" && path === "/readyz") {
    sendJson(res, 200, {
      ok: true,
      service: "se-cli-mcp",
      runtime: "real-mcp-read-only",
      database: process.env.DATABASE_URL ? "configured" : "not configured",
      queue: process.env.QUEUE_URL || process.env.REDIS_URL ? "configured" : "not configured",
    });
    return;
  }

  if (req.method === "GET" && path === "/status") {
    sendJson(res, 200, createStateCard());
    return;
  }

  if (path === normalizePath(process.env.SECLI_MCP_PATH || "/mcp")) {
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

      const response = handleRpc(request);
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

  if (req.method === "GET" && path === "/") {
    sendJson(res, 200, {
      ok: true,
      service: "se-cli-mcp",
      runtime: "real-mcp-read-only",
      message: "SE-CLI real MCP read-only runtime. Available endpoints: /healthz, /readyz, /status, /mcp",
    });
    return;
  }

  sendJson(res, 404, {
    ok: false,
    service: "se-cli-mcp",
    runtime: "real-mcp-read-only",
    message: "Route not found. Available endpoints: /healthz, /readyz, /status, /mcp",
    path,
  });
});

server.listen(port, host, () => {
  console.log(`SE-CLI MCP server listening on ${host}:${port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received; shutting down SE-CLI MCP server");
  server.close(() => process.exit(0));
});
