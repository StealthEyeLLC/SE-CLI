# SE-CLI Render bootstrap image.
#
# This Dockerfile intentionally works before the full MCP runtime exists.
# It gives Render a deployable web service with health/status endpoints so the
# infrastructure can be connected early. Replace the bootstrap server with the
# real apps/mcp-server runtime in the implementation mission.

FROM node:24-slim

ENV NODE_ENV=production
ENV SECLI_ENV=production
ENV PORT=10000
ENV SECLI_MCP_PATH=/mcp

WORKDIR /app

RUN mkdir -p /app/.render-bootstrap

RUN cat > /app/.render-bootstrap/server.mjs <<'EOF'
import http from 'node:http';

const port = Number.parseInt(process.env.PORT || '10000', 10);
const host = '0.0.0.0';
const startedAt = new Date().toISOString();

function sendJson(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function stateCard() {
  return {
    service: 'se-cli-mcp-bootstrap',
    mode: 'bootstrap',
    mission: 'M-2026-06-01-001 Initialize SE-CLI documentation and Render setup spine',
    branch: process.env.SECLI_DEFAULT_BRANCH || 'main',
    pr: null,
    ci: 'not configured yet',
    worker: 'not implemented yet',
    render: 'bootstrap service healthy',
    last_action: 'Render bootstrap Dockerfile deployed',
    next_action: 'replace bootstrap server with real MCP runtime',
    blocked: false,
    needs_approval: 'normal mission approval for implementation work',
    risk: 'low',
    started_at: startedAt,
    updated_at: new Date().toISOString(),
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/healthz') {
    sendJson(res, 200, { ok: true, service: 'se-cli-mcp-bootstrap', started_at: startedAt });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/readyz') {
    sendJson(res, 200, {
      ok: true,
      service: 'se-cli-mcp-bootstrap',
      mode: 'bootstrap',
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      queue: process.env.QUEUE_URL || process.env.REDIS_URL ? 'configured' : 'not configured',
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/status') {
    sendJson(res, 200, stateCard());
    return;
  }

  if (url.pathname === (process.env.SECLI_MCP_PATH || '/mcp')) {
    if (req.method !== 'POST') {
      sendJson(res, 405, {
        ok: false,
        error: 'MCP bootstrap endpoint expects POST. Real MCP runtime is not implemented yet.',
      });
      return;
    }

    try {
      await readBody(req);
      sendJson(res, 501, {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'SE-CLI MCP bootstrap is deployed, but the real MCP runtime is not implemented yet.',
        },
        id: null,
      });
    } catch (error) {
      sendJson(res, 413, {
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: error instanceof Error ? error.message : 'invalid request',
        },
        id: null,
      });
    }
    return;
  }

  sendJson(res, 404, {
    ok: false,
    service: 'se-cli-mcp-bootstrap',
    message: 'SE-CLI bootstrap service. Available endpoints: /healthz, /readyz, /status, /mcp',
  });
});

server.listen(port, host, () => {
  console.log(`SE-CLI bootstrap service listening on ${host}:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received; shutting down SE-CLI bootstrap service');
  server.close(() => process.exit(0));
});
EOF

EXPOSE 10000

CMD ["node", "/app/.render-bootstrap/server.mjs"]
